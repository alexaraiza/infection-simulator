import * as people from "./people/people.js";
import { draw, erase } from "./animations/canvas.js";


export const HEALTHY_COLOR = "#00bf5f";
export const INFECTED_COLOR = "#bf0000";
export const IMMUNE_COLOR = "#ffbf00";

const DEFAULT_HEALTHY_PEOPLE = 99;
const DEFAULT_INFECTED_PEOPLE = 1;
const DEFAULT_IMMUNE_PEOPLE = 0;

const DEFAULT_SPEED_INPUT = 50;
const DEFAULT_RADIUS_INPUT = 5;

const DEFAULT_INFECTED_TIME = 10;
const DEFAULT_IMMUNE_TIME = 180;

export var MAX_PEOPLE = 1000;
export var MONITOR_REFRESH_RATE = 60;

export var personInitialSpeed = DEFAULT_SPEED_INPUT / MONITOR_REFRESH_RATE;
export var personRadius = DEFAULT_RADIUS_INPUT;
export var infectedFrames = DEFAULT_INFECTED_TIME * MONITOR_REFRESH_RATE;
export var immuneFrames = DEFAULT_IMMUNE_TIME * MONITOR_REFRESH_RATE;


export function resetSettings() {
  personInitialSpeed = DEFAULT_SPEED_INPUT / MONITOR_REFRESH_RATE;

  personRadius = DEFAULT_RADIUS_INPUT;

  infectedFrames = DEFAULT_INFECTED_TIME * MONITOR_REFRESH_RATE;
  immuneFrames = DEFAULT_IMMUNE_TIME * MONITOR_REFRESH_RATE;

  people.add(DEFAULT_HEALTHY_PEOPLE, "healthy");
  people.add(DEFAULT_INFECTED_PEOPLE, "infected");
  people.add(DEFAULT_IMMUNE_PEOPLE, "immune");
  draw(people.people);

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

  if (input < target.previousValue) {
    let removedPeople = people.remove(target.previousValue - input, target.id.slice(0, -5));
    erase(removedPeople);
  }
  else {
    let state = target.id.slice(0, -5);
    let addedPeople = people.add(input - target.previousValue, state);
    let removedPeople = people.removeExcessPeople(state);
    erase(removedPeople);
    draw(addedPeople);
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
  for (let person of people.people) {
    person.velocity.x *= ratio;
    person.velocity.y *= ratio;
  }
  personInitialSpeed = input / MONITOR_REFRESH_RATE;
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