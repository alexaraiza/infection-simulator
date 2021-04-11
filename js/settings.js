import * as people from "./people/people.js";
import { drawPeople, erasePeople } from "./animations/canvas.js";


const DEFAULT_HEALTHY_PEOPLE = 99;
const DEFAULT_INFECTED_PEOPLE = 1;
const DEFAULT_IMMUNE_PEOPLE = 0;

const DEFAULT_INFECTION_RATE = 20;
const DEFAULT_DEATH_RATE = 5;

const DEFAULT_INFECTED_TIME = 10;
const DEFAULT_IMMUNE_TIME = 180;

const DEFAULT_SPEED_INPUT = 50;
const DEFAULT_RADIUS_INPUT = 5;

const DEFAULT_WALL_THICKNESS = 5;

const MAX_PEOPLE = 1000;
const MAX_RATE = 100;
const MAX_SPEED = 100;
const MAX_RADIUS = 10;


export const COLORS = {
  healthy: "#7fdf1f",
  infected: "#df1f1f",
  immune: "#1f7fdf",
  deaths: "#000000",
  healthyHover: "#5fa717",
  infectedHover: "#a71717",
  immuneHover: "#175fa7",
  wall: "#000000",
}

export let MONITOR_REFRESH_RATE = 60;

export let infectionRate = DEFAULT_INFECTION_RATE / 100;
export let deathRate = DEFAULT_DEATH_RATE / 100;

export let infectedFrames = DEFAULT_INFECTED_TIME * MONITOR_REFRESH_RATE;
export let immuneFrames = DEFAULT_IMMUNE_TIME * MONITOR_REFRESH_RATE;

export let speed = DEFAULT_SPEED_INPUT / MONITOR_REFRESH_RATE;
export let radius = DEFAULT_RADIUS_INPUT;

export let wallThickness = DEFAULT_WALL_THICKNESS;

export let speedIsZero = false;




export function resetSettings() {
  infectionRate = DEFAULT_INFECTION_RATE / 100;
  deathRate = DEFAULT_DEATH_RATE / 100;

  infectedFrames = DEFAULT_INFECTED_TIME * MONITOR_REFRESH_RATE;
  immuneFrames = DEFAULT_IMMUNE_TIME * MONITOR_REFRESH_RATE;

  speed = DEFAULT_SPEED_INPUT / MONITOR_REFRESH_RATE;
  radius = DEFAULT_RADIUS_INPUT;
}

export function resetPeople() {
  people.removeAllPeople();
  people.add(DEFAULT_HEALTHY_PEOPLE, "healthy");
  people.add(DEFAULT_INFECTED_PEOPLE, "infected");
  people.add(DEFAULT_IMMUNE_PEOPLE, "immune");
  drawPeople(people.people);
}

export function resetInputs() {
  setPeopleCountInputs();
  setInfectionRateInputs(DEFAULT_INFECTION_RATE);
  setDeathRateInputs(DEFAULT_DEATH_RATE);
  setSpeedInputs(DEFAULT_SPEED_INPUT);
  setRadiusInputs(DEFAULT_RADIUS_INPUT);

  infectedTime.value = DEFAULT_INFECTED_TIME;
  immuneTime.value = DEFAULT_IMMUNE_TIME;
  infectedTime.previousValue = DEFAULT_INFECTED_TIME;
  immuneTime.previousValue = DEFAULT_IMMUNE_TIME;
}


export function setPeopleCounts(target) {
  let inputNumber = getInputNumber(target.value, 0, MAX_PEOPLE);

  if (inputNumber === undefined) {
    target.value = target.previousValue;
    return;
  }

  let state = target.id.slice(0, -5);

  if (inputNumber < target.previousValue) {
    let removedPeople = people.remove(target.previousValue - inputNumber, state);
    erasePeople(removedPeople);
  }
  else {
    let peopleToAdd = inputNumber - target.previousValue;
    let removedPeople = people.removeExcessPeople(peopleToAdd + people.count.total - MAX_PEOPLE, state);
    let addedPeople = people.add(peopleToAdd, state);
    erasePeople(removedPeople);
    drawPeople(addedPeople);
  }
}

export function setPeopleCountInputs() {
  healthyCount.value = people.count.healthy;
  infectedCount.value = people.count.infected;
  immuneCount.value = people.count.immune;

  healthyCount.previousValue = people.count.healthy;
  infectedCount.previousValue = people.count.infected;
  immuneCount.previousValue = people.count.immune;
}


export function setInfectionRate() {
  let inputNumber = getInputNumber(infectionRateInput.value, 0, MAX_RATE);

  if (inputNumber === undefined) {
    infectionRateInput.value = infectionRateInput.previousValue;
    return;
  }

  infectionRate = inputNumber;
  setInfectionRateInputs(inputNumber);
}

function setInfectionRateInputs(infectionRate) {
  infectionRateInput.value = infectionRate;
  infectionRateSlider.value = infectionRate;

  infectionRateInput.previousValue = infectionRate;
}


export function setDeathRate() {
  let inputNumber = getInputNumber(deathRateInput.value, 0, MAX_RATE);

  if (inputNumber === undefined) {
    deathRateInput.value = deathRateInput.previousValue;
    return;
  }

  deathRate = inputNumber;
  setDeathRateInputs(inputNumber);
}

function setDeathRateInputs(deathRate) {
  deathRateInput.value = deathRate;
  deathRateSlider.value = deathRate;

  deathRateInput.previousValue = deathRate;
}


export function setTimes(target) {
  let inputNumber = getInputNumber(target.value, 0);

  if (inputNumber === undefined) {
    target.value = target.previousValue;
    return;
  }

  if (target.id.slice(0, -4) === "infected") {
    infectedFrames = inputNumber * MONITOR_REFRESH_RATE;
  }
  else if (target.id.slice(0, -4) === "immune") {
    immuneFrames = inputNumber * MONITOR_REFRESH_RATE;
  }

  target.value = inputNumber;
  target.previousValue = inputNumber;
}


export function setSpeeds() {
  let inputNumber = getInputNumber(speedInput.value, 0, MAX_SPEED);

  if (inputNumber === undefined) {
    speedInput.value = speedInput.previousValue;
    return;
  }

  let ratio = inputNumber / (speed * MONITOR_REFRESH_RATE);
  if (ratio === 0) {
    speedIsZero = true;
  }
  else {
    speedIsZero = false;
    for (let person of people.people) {
      person.velocity.x *= ratio;
      person.velocity.y *= ratio;
    }
    speed = inputNumber / MONITOR_REFRESH_RATE;
  }
  setSpeedInputs(inputNumber);
}

function setSpeedInputs(speed) {
  speedInput.value = speed;
  speedSlider.value = speed;

  speedInput.previousValue = speed;
}


export function setRadiuses() {
  let inputNumber = getInputNumber(radiusInput.value, 0, MAX_RADIUS);

  if (inputNumber === undefined) {
    radiusInput.value = radiusInput.previousValue;
    return;
  }

  for (let person of people.people) {
    person.radius = inputNumber;
  }

  radius = inputNumber;
  setRadiusInputs(inputNumber);
}

function setRadiusInputs(radius) {
  radiusInput.value = radius;
  radiusSlider.value = radius;

  radiusInput.previousValue = radius;
}




function getInputNumber(inputString, minNumber, maxNumber) {
  let inputNumber = parseInt(inputString);

  if (isNaN(inputNumber)) return;

  if (inputNumber < minNumber) {
    inputNumber = minNumber;
  }
  else if (inputNumber > maxNumber) {
    inputNumber = maxNumber;
  }

  return inputNumber;
}