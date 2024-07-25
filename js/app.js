import ExerciseContext from "./exercise-context.js";
import exercises from "./exercises.js";

const container = document.querySelector("#main");
const audio = new Audio("audio/beep.mp3");

if (!container) {
  throw new Error("#main element not found");
}

new ExerciseContext(container, exercises, audio).toStart();
