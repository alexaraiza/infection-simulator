import * as people from "./people/people.js";
import { drawPeople, erasePeople } from "./animations/canvas.js";


export const COLORS = {
  "healthy": "#7fdf1f",
  "infected": "#df1f1f",
  "immune": "#1f7fdf",
  "healthyHover": "#5fa717",
  "infectedHover": "#a71717",
  "immuneHover": "#175fa7",
  "wall": "#000000",
}

const DEFAULT_HEALTHY_PEOPLE = 99;
const DEFAULT_INFECTED_PEOPLE = 1;
const DEFAULT_IMMUNE_PEOPLE = 0;

const DEFAULT_SPEED_INPUT = 50;
const DEFAULT_RADIUS_INPUT = 5;

const DEFAULT_INFECTED_TIME = 10;
const DEFAULT_IMMUNE_TIME = 180;

const DEFAULT_WALL_THICKNESS = 5;

const MAX_PEOPLE = 1000;
export let MONITOR_REFRESH_RATE = 60;

export let personInitialSpeed = DEFAULT_SPEED_INPUT / MONITOR_REFRESH_RATE;
export let personRadius = DEFAULT_RADIUS_INPUT;
export let infectedFrames = DEFAULT_INFECTED_TIME * MONITOR_REFRESH_RATE;
export let immuneFrames = DEFAULT_IMMUNE_TIME * MONITOR_REFRESH_RATE;

export let wallThickness = DEFAULT_WALL_THICKNESS;

export let speedIsZero = false;


export function resetSettings() {
  personInitialSpeed = DEFAULT_SPEED_INPUT / MONITOR_REFRESH_RATE;

  personRadius = DEFAULT_RADIUS_INPUT;

  infectedFrames = DEFAULT_INFECTED_TIME * MONITOR_REFRESH_RATE;
  immuneFrames = DEFAULT_IMMUNE_TIME * MONITOR_REFRESH_RATE;

  people.add(DEFAULT_HEALTHY_PEOPLE, "healthy");
  people.add(DEFAULT_INFECTED_PEOPLE, "infected");
  people.add(DEFAULT_IMMUNE_PEOPLE, "immune");
  drawPeople(people.people);

  resetInputs();
}

function resetInputs() {
  healthyCount.max = MAX_PEOPLE;
  infectedCount.max = MAX_PEOPLE;
  immuneCount.max = MAX_PEOPLE;

  setPeopleCountInputs();
  setInitialSpeedInputs(DEFAULT_SPEED_INPUT);
  setInitialRadiusInputs(DEFAULT_RADIUS_INPUT);
  
  infectedTime.value = DEFAULT_INFECTED_TIME;
  immuneTime.value = DEFAULT_IMMUNE_TIME;
  infectedTime.previousValue = DEFAULT_INFECTED_TIME;
  immuneTime.previousValue = DEFAULT_IMMUNE_TIME;

  chartSelect.value = "people";
}


export function setPeopleCounts(event) {
  const target = event.target;
  let input = parseInt(target.value);

  if (isNaN(input)) {
    target.value = target.previousValue;
    return;
  }

  if (input < 0) {
    input = 0;
  }
  else if (input > MAX_PEOPLE) {
    input = MAX_PEOPLE;
  }

  let state = target.id.slice(0, -5);

  if (input < target.previousValue) {
    let removedPeople = people.remove(target.previousValue - input, state);
    erasePeople(removedPeople);
  }
  else {
    let peopleToAdd = input - target.previousValue;
    let removedPeople = people.removeExcessPeople(peopleToAdd + people.count.total - MAX_PEOPLE, state);
    let addedPeople = people.add(peopleToAdd, state);
    erasePeople(removedPeople);
    drawPeople(addedPeople);
  }
  setPeopleCountInputs();
}

export function setPeopleCountInputs() {
  healthyCount.value = people.count.healthy;
  infectedCount.value = people.count.infected;
  immuneCount.value = people.count.immune;

  healthyCount.previousValue = people.count.healthy;
  infectedCount.previousValue = people.count.infected;
  immuneCount.previousValue = people.count.immune;
}


export function setInitialSpeeds() {
  let input = parseInt(speedInput.value);

  if (isNaN(input)) {
    speedInput.value = speedInput.previousValue;
    return;
  }

  if (input < 0) {
    input = 0;
  }
  else if (input > 100) {
    input = 100;
  }

  let ratio = input / (personInitialSpeed * MONITOR_REFRESH_RATE);
  if (ratio === 0) {
    speedIsZero = true;
  }
  else {
    speedIsZero = false;
    for (let person of people.people) {
      person.velocity.x *= ratio;
      person.velocity.y *= ratio;
    }
    personInitialSpeed = input / MONITOR_REFRESH_RATE;
  }
  setInitialSpeedInputs(input);
}

function setInitialSpeedInputs(input) {
  speedInput.value = input;
  speedSlider.value = input;

  speedInput.previousValue = input;
}


export function setInitialRadiuses() {
  let input = parseInt(radiusInput.value);

  if (isNaN(input)) {
    radiusInput.value = radiusInput.previousValue;
    return;
  }

  if (input < 0) {
    input = 0;
  }
  else if (input > 10) {
    input = 10;
  }

  for (let person of people.people) {
    person.radius = input;
  }

  personRadius = input;
  setInitialRadiusInputs(input);
}

function setInitialRadiusInputs(input) {
  radiusInput.value = input;
  radiusSlider.value = input;

  radiusInput.previousValue = input;
}


export function setTimes(event) {
  const target = event.target;
  let input = parseFloat(target.value);

  if (isNaN(input)) {
    target.value = target.previousValue;
    return;
  }

  if (input < 0) {
    input = 0;
  }

  if (target.id.slice(0, -4) === "infected") {
    infectedFrames = input * MONITOR_REFRESH_RATE;
  }
  else if (target.id.slice(0, -4) === "immune") {
    immuneFrames = input * MONITOR_REFRESH_RATE;
  }

  target.value = input;
  target.previousValue = input;
}