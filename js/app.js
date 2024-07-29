import ExerciseContext from "./exercise-context.js";
import exercises from "./exercises.js";

const container = document.querySelector("#main");
if (!container) {
  throw new Error("#main element not found");
}

const sounds = {
  start: new Audio("audio/start.mp3"),
  countdown: new Audio("audio/countdown.mp3"),
};

new ExerciseContext(container, exercises, sounds).toStart();
