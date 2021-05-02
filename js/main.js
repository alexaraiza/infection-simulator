import * as settings from "./settings.js";
import { previousPage, nextPage } from "./tutorial.js";
import * as people from "./people/people.js";
import * as walls from "./walls/walls.js";
import { getMousePosition, resize as resizeCanvas } from "./animations/canvas.js";
import * as chart from "./animations/chart.js";


let isPlaying = false;
export let frameCount = 0;
let nextFrameID;

let mousePosition = [0, 0];
let mouseIsDown = false;

let selectedAction = "selectPerson";

const ACTION_MAP = {
  selectPerson: people.hoverMouse,
  placeWall: walls.editWall,
  removeWall: walls.hoverMouse
}


function play() {
  frameCount++;

  people.changeState(frameCount);

  if (!settings.speedIsZero) {
    people.move();
    people.collide();
  }

  people.redrawPeople();

  settings.setPeopleCountInputs();

  if (frameCount % settings.MONITOR_REFRESH_RATE === 0) {
    people.countHistory.addCurrentCount();
    chart.update();
    people.count.dailyReset();
  }

  nextFrameID = window.requestAnimationFrame(play);
}


function togglePlayPause() {
  if (isPlaying) {
    playPauseButton.innerHTML = "Play";
    window.cancelAnimationFrame(nextFrameID);
    isPlaying = false;
  }
  else {
    playPauseButton.innerHTML = "Pause";
    nextFrameID = window.requestAnimationFrame(play);
    isPlaying = true;
  }
}


document.addEventListener("DOMContentLoaded", function() {
  chart.create("people");
  reset();
  addEventListeners();
});


function reset() {
  resizeCanvas();
  frameCount = 0;
  settings.resetSettings();
  settings.resetPeople();
  settings.resetInputs();
  walls.removeAllWalls();
  people.countHistory.setLastCount();
  chart.update();
}


function addEventListeners() {
  addInputEventListeners();

  touchBox.addEventListener("mouseenter", function(event) {
    mousePosition = getMousePosition(event);
    if (selectedAction === "placeWall") {
      walls.newWall(mousePosition[0], mousePosition[1]);
    }
  });

  touchBox.addEventListener("mouseleave", function() {
    if (selectedAction === "selectPerson") {
      people.unhoverPeople();
    }
    else if (selectedAction === "placeWall") {
      walls.deleteWallInConstruction();
    }
  });

  touchBox.addEventListener("mousemove", function(event) {
    mousePosition = getMousePosition(event);
    ACTION_MAP[selectedAction](mousePosition[0], mousePosition[1], mouseIsDown);
  });

  touchBox.addEventListener("click", function() {
    if (selectedAction === "removeWall") {
      walls.removeHoveringWall();
    }
  });

  touchBox.addEventListener("mousedown", () => mouseIsDown = true);
  document.addEventListener("mouseup", () => mouseIsDown = false);

  touchBox.addEventListener("mouseup", function(event) {
    mousePosition = getMousePosition(event);
    if (mouseIsDown && selectedAction === "placeWall") {
      walls.placeWall();
      walls.newWall(mousePosition[0], mousePosition[1]);
    }
  });

  chartSelect.addEventListener("change", () => chart.change(chartSelect.value));

  resetButton.addEventListener("click", reset)
  playPauseButton.addEventListener("click", togglePlayPause);
}


function addInputEventListeners() {
  closeTutorialModalButton.addEventListener("click", closeTutorialModal);

  previousPageTutorialButton.addEventListener("click", previousPage);
  nextPageTutorialButton.addEventListener("click", nextPage);

  for (let element of document.getElementsByClassName("select-person-button")) {
    element.addEventListener("click", () => selectedAction = "selectPerson");
  }
  for (let element of document.getElementsByClassName("place-wall-button")) {
    element.addEventListener("click", () => selectedAction = "placeWall");
  }
  for (let element of document.getElementsByClassName("remove-wall-button")) {
    element.addEventListener("click", () => selectedAction = "removeWall");
  }

  settingsButton.addEventListener("click", openSettingsModal);
  closeSettingsModalButton.addEventListener("click", closeSettingsModal);

  for (let element of document.getElementsByClassName("people-count-input")) {
    element.addEventListener("change", handlePeopleCountInputChange);
  }

  for (let element of document.getElementsByClassName("people-count-button")) {
    let target = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", () => handlePeopleCountButtonClick(target, element.id.slice(-2)));
  }

  infectionRateSlider.addEventListener("input", () => infectionRateInput.value = infectionRateSlider.value);
  infectionRateInput.addEventListener("input", () => infectionRateSlider.value = infectionRateInput.value);
  infectionRateInput.addEventListener("change", handleInfectionRateInputChange);
  infectionRateSlider.addEventListener("change", handleInfectionRateInputChange);

  deathRateSlider.addEventListener("input", () => deathRateInput.value = deathRateSlider.value);
  deathRateInput.addEventListener("input", () => deathRateSlider.value = deathRateInput.value);
  deathRateInput.addEventListener("change", handleDeathRateInputChange);
  deathRateSlider.addEventListener("change", handleDeathRateInputChange);

  for (let element of document.getElementsByClassName("time-input")) {
    element.addEventListener("change", handleTimeInputChange);
  }

  for (let element of document.getElementsByClassName("time-button")) {
    let target = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", () => handleTimeButtonClick(target, element.id.slice(-2)));
  }

  speedSlider.addEventListener("input", () => speedInput.value = speedSlider.value);
  speedInput.addEventListener("input", () => speedSlider.value = speedInput.value);
  speedInput.addEventListener("change", handleSpeedInputChange);
  speedSlider.addEventListener("change", handleSpeedInputChange);

  radiusSlider.addEventListener("input", () => radiusInput.value = radiusSlider.value);
  radiusInput.addEventListener("input", () => radiusSlider.value = radiusInput.value);
  radiusInput.addEventListener("change", handleRadiusInputChange);
  radiusSlider.addEventListener("change", handleRadiusInputChange);
}


function closeTutorialModal() {
  tutorialModal.style.opacity = 0;
  setTimeout(() => tutorialModal.style.visibility = "hidden", 250);
}

function openSettingsModal() {
  settingsModal.style.visibility = "visible";
  settingsModal.style.opacity = 1;
  window.addEventListener("click", settingsModalClick);
}

function closeSettingsModal() {
  settingsModal.style.opacity = "";
  setTimeout(() => settingsModal.style.visibility = "", 250);
  window.removeEventListener("click", settingsModalClick);
}

function settingsModalClick(event) {
  if (event.target === settingsModal) {
    closeSettingsModal();
  }
}

function handlePeopleCountInputChange(event) {
  settings.setPeopleCounts(event.target);
  settings.setPeopleCountInputs();
  if (frameCount === 0) {
    people.countHistory.setLastCount();
    chart.update();
  }
}

function handlePeopleCountButtonClick(target, operation) {
  if (operation === "++") target.value++;
  else target.value--;
  handlePeopleCountInputChange({ target: target });
}

function handleInfectionRateInputChange() {
  settings.setInfectionRate();
}

function handleDeathRateInputChange() {
  settings.setDeathRate();
}

function handleTimeInputChange(event) {
  settings.setTimes(event.target);
}

function handleTimeButtonClick(target, operation) {
  if (operation === "++") target.value++;
  else target.value--;
  handleTimeInputChange({ target: target });
}

function handleSpeedInputChange() {
  settings.setSpeeds();
}

function handleRadiusInputChange() {
  settings.setRadiuses();
  people.redrawPeople();
}