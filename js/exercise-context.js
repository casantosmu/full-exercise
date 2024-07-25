export default class ExerciseContext {
  #state;
  #index;
  #container;
  #exercises;
  #audio;

  /**
   * @param {Element} container - The HTML container element for the exercises.
   * @param {Object[]} exercises - The list of exercises.
   * @param {string} exercises[].title - The title of the exercise.
   * @param {string} exercises[].img - The image URL of the exercise.
   * @param {number} exercises[].msDuration - The duration of the exercise in milliseconds.
   * @param {HTMLAudioElement} audio - The HTML audio element used to play sound when finishing an exercise.
   */
  constructor(container, exercises, audio) {
    this.#state = new StartState(this);
    this.#index = 0;
    this.#container = container;
    this.#exercises = exercises;
    this.#audio = audio;
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

  playSound() {
    this.#audio.play();
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
      this.context.toPlay();
    });
  }
}

class PlayingState extends State {
  render() {
    const exercise = this.context.exercise;

    const timeout = setTimeout(() => {
      this.context.playSound();
      this.context.toNext();
    }, exercise.msDuration);

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
      clearTimeout(timeout);
      this.context.toPrevious();
    });
    this.context.onClick("#pause-btn", () => {
      clearTimeout(timeout);
      this.context.toPause();
    });
    this.context.onClick("#next-btn", () => {
      clearTimeout(timeout);
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
      this.context.toPlay();
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
