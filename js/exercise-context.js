export default class ExerciseContext {
  #state;
  #index;
  #container;
  #exercises;
  #sounds;

  /**
   * @param {Element} container - The HTML container element for the exercises.
   * @param {Object[]} exercises - The list of exercises.
   * @param {string} exercises[].title - The title of the exercise.
   * @param {string} exercises[].img - The image URL of the exercise.
   * @param {number} exercises[].msDuration - The duration of the exercise in milliseconds.
   * @param {Object} sounds - An object containing the sounds.
   * @param {HTMLAudioElement} sounds.start - The HTML audio element used to play the start sound.
   * @param {HTMLAudioElement} sounds.countdown - The HTML audio element used to play the countdown sound.
   */
  constructor(container, exercises, sounds) {
    this.#state = new StartState(this);
    this.#index = 0;
    this.#container = container;
    this.#exercises = exercises;
    this.#sounds = sounds;
  }

  get exercise() {
    const exercise = this.#exercises[this.#index];
    if (exercise === undefined) {
      throw new Error("Index is out of bounds");
    }

    return exercise;
  }

  /**
   * Transitions to a new state and renders it.
   * @param {State} state - The new state to transition to.
   */
  transitionTo(state) {
    this.#state = state;
    this.#state.render();
  }

  toStart() {
    this.#index = 0;
    this.transitionTo(new StartState(this));
  }

  toCountdown() {
    this.transitionTo(new CountdownState(this));
  }

  toPlay() {
    this.transitionTo(new PlayingState(this));
  }

  toNext() {
    this.#index++;

    if (this.#index >= this.#exercises.length) {
      this.transitionTo(new CompletedState(this));
      return;
    }

    this.transitionTo(new PlayingState(this));
  }

  toPrevious() {
    if (this.#index > 0) {
      this.#index--;
    }

    this.transitionTo(new PlayingState(this));
  }

  toPause() {
    this.transitionTo(new PausedState(this));
  }

  /**
   * Plays the specified sound.
   * @param {'start' | 'countdown'} sound - The sound to play.
   */
  playSound(sound) {
    this.#sounds[sound].play();
  }

  /**
   * Updates the HTML content of the container element.
   * @param {string} content - The HTML content to set.
   */
  html(content) {
    this.#container.innerHTML = content;
  }

  /**
   * Adds a click event listener to elements matching the selector.
   * @param {string} selector - The CSS selector for the elements.
   * @param {EventListenerOrEventListenerObject} callback - The callback function for the click event.
   */
  onClick(selector, callback) {
    const elements = this.#container.querySelectorAll(selector);
    for (const element of elements) {
      element.addEventListener("click", callback);
    }
  }
}

/**
 * Abstract base class for exercise states.
 * @abstract
 */
class State {
  /**
   * @param {ExerciseContext} context - The context of the exercises.
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Renders the state.
   */
  render() {
    throw new Error("Render method not implemented");
  }
}

class StartState extends State {
  render() {
    this.context.html(`
      <h1>10-Minute Beginner Workout</h1>
      <button id="start-btn">Start Workout</button>
    `);

    this.context.onClick("#start-btn", () => {
      this.context.toCountdown();
    });
  }
}

class CountdownState extends State {
  render() {
    let countdown = 3;

    this.context.playSound("countdown");
    this.context.html(`<h1>${countdown}</h1>`);

    const intervalId = setInterval(() => {
      countdown--;

      if (countdown > 0) {
        this.context.playSound("countdown");
        this.context.html(`<h1>${countdown}</h1>`);
      } else {
        clearInterval(intervalId);
        this.context.playSound("start");
        this.context.toPlay();
      }
    }, 1000);
  }
}

class PlayingState extends State {
  #setupTimer() {
    const exercise = this.context.exercise;

    /** @type {number=} */
    let intervalId;

    const timeoutId = setTimeout(() => {
      let countdown = 3;
      this.context.playSound("countdown");

      intervalId = setInterval(() => {
        countdown--;

        if (countdown > 0) {
          this.context.playSound("countdown");
        } else {
          clearInterval(intervalId);
          this.context.playSound("start");
          this.context.toNext();
        }
      }, 1000);
    }, exercise.msDuration - 3000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }

  render() {
    const clearTimer = this.#setupTimer();
    const exercise = this.context.exercise;

    this.context.html(`
      <section>
        <h1>${exercise.title}</h1>
        <img src="${exercise.img}" alt="${exercise.title}" width="400" height="300">
      </section>
      <button id="prev-btn">Previous</button>
      <button id="pause-btn">Pause</button>
      <button id="next-btn">Next</button>
    `);

    this.context.onClick("#prev-btn", () => {
      clearTimer();
      this.context.toPrevious();
    });
    this.context.onClick("#pause-btn", () => {
      clearTimer();
      this.context.toPause();
    });
    this.context.onClick("#next-btn", () => {
      clearTimer();
      this.context.toNext();
    });
  }
}

class PausedState extends State {
  render() {
    const exercise = this.context.exercise;

    this.context.html(`
      <section>
        <h1>${exercise.title}</h1>
        <img src="${exercise.img}" alt="${exercise.title}" width="400" height="300">
      </section>
      <button id="resume-btn">Resume</button>
      <button id="exit-btn">Exit</button>
    `);

    this.context.onClick("#resume-btn", () => {
      this.context.toCountdown();
    });
    this.context.onClick("#exit-btn", () => {
      this.context.toStart();
    });
  }
}

class CompletedState extends State {
  render() {
    this.context.html(`
      <h1>All exercises completed!</h1>
      <button id="back-btn">Back</button>
    `);

    this.context.onClick("#back-btn", () => {
      this.context.toStart();
    });
  }
}
