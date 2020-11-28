import Person from "./Person.js";
import { frameCount } from "../main.js";
import { MAX_PEOPLE, personInitialSpeed, personRadius, infectedFrames, immuneFrames } from "../settings.js";


export const people = [];

export const count = {
  "healthy": 0,
  "infected": 0,
  "immune": 0,
  "total": 0
}

export const countHistory = {
  "healthy": [],
  "infected": [],
  "immune": [],
  "total": [],
  addCurrentCount: function() {
    for (let state in count) {
      this[state].push(count[state]);
    }
  },
  setCurrentCount: function() {
    for (let state in count) {
      this[state][this[state].length - 1] = count[state];
    }
  }
}


export function move() {
  for (let person of people) {
    person.move();
  }

  for (let i = 0; i < people.length; i++) {
    checkPeopleCollisions(i);
    checkWallCollisions(people[i]);
  }
}


export function add(n, state) {
  let addedPeople = [];

  for (var addedCount = 0; addedCount < n; addedCount++) {
    let tries = 0;
    do {
      let angle = 2 * Math.PI * Math.random();
      people.push(new Person(personRadius + Math.random() * (animationCanvas.width - 2 * personRadius), personRadius + Math.random() * (animationCanvas.height - 2 * personRadius), personInitialSpeed * Math.cos(angle), personInitialSpeed * Math.sin(angle), personRadius, state));
      var personIsValid = true;

      for (let person of people) {
        if (people[people.length - 1] === person) continue;
        if (getDistance(people[people.length - 1], person) <= people[people.length - 1].radius + person.radius) {
          personIsValid = false;
          people.pop();
          break;
        }
      }

      tries++
    }
    while (!personIsValid && tries < 1000);

    if (personIsValid) {
      addedPeople.push(people[people.length - 1]);
    }
    else {
      break;
    }
  }

  count[state] += addedCount;
  count.total += addedCount;

  return addedPeople;
}


export function remove(n, state) {
  let removedPeople = [];
  let removedCount = 0;
  let i = people.length - 1;

  while (removedCount < n && i >= 0) {
    if (people[i].state === state) {
      removedPeople.push(people[i]);
      people.splice(i, 1);
      removedCount++;
    }
    i--;
  }

  count[state] -= removedCount;
  count.total -= removedCount;

  return removedPeople;
}


export function removeExcessPeople(incomingState) {
  let excessPeople = count.total - MAX_PEOPLE;

  if (excessPeople <= 0) return [];

  const PRIORITIES = {
    "healthy": ["immune", "infected"],
    "infected": ["healthy", "immune"],
    "immune": ["healthy", "infected"]
  }

  let firstPriority = PRIORITIES[incomingState][0];
  let secondPriority = PRIORITIES[incomingState][1];

  if (count[firstPriority] >= excessPeople) {
    return remove(excessPeople, firstPriority);
  }
  else {
    let removedPeople = remove(count[firstPriority], firstPriority);
    return removedPeople.concat(remove(excessPeople - count[firstPriority], secondPriority));
  }
}


export function checkStateChange() {
  for (let person of people) {
    if (person.state === "infected" && frameCount - person.stateChangeFrame > infectedFrames) {
      person.setState("immune");
      count.infected--;
      count.immune++;
    }
    if (person.state === "immune" && frameCount - person.stateChangeFrame > immuneFrames) {
      person.setState("healthy");
      count.immune--;
      count.healthy++;
    }
  }
}


export function checkPeopleCollisions(i) {
  for (let j = i + 1; j < people.length; j++) {
    let xDistance = people[j].position.x - people[i].position.x;
    let yDistance = people[j].position.y - people[i].position.y;
    let totalDistance = Math.hypot(xDistance, yDistance);

    if (totalDistance <= people[i].radius + people[j].radius) {
      let sine = yDistance / totalDistance;
      let cosine = xDistance / totalDistance;

      let iNormalVelocity = cosine * people[i].velocity.x + sine * people[i].velocity.y;
      let iTangentialVelocity = sine * people[i].velocity.x - cosine * people[i].velocity.y;
      let jNormalVelocity = cosine * people[j].velocity.x + sine * people[j].velocity.y;
      let jTangentialVelocity = sine * people[j].velocity.x - cosine * people[j].velocity.y;

      if (iNormalVelocity <= jNormalVelocity) continue;

      [people[i].velocity.x, people[i].velocity.y, people[j].velocity.x, people[j].velocity.y] = [
        cosine * jNormalVelocity + sine * iTangentialVelocity,
        sine * jNormalVelocity - cosine * iTangentialVelocity,
        cosine * iNormalVelocity + sine * jTangentialVelocity,
        sine * iNormalVelocity - cosine * jTangentialVelocity];

      if (people[i].state === "healthy" && people[j].state === "infected") {
        people[i].setState("infected");
        count.healthy--;
        count.infected++;
      }
      else if (people[i].state === "infected" && people[j].state === "healthy") {
        people[j].setState("infected");
        count.healthy--;
        count.infected++;
      }
    }
  }
}


export function checkWallCollisions(person) {
  if (person.position.x - person.radius <= 0) {
    person.velocity.x = Math.abs(person.velocity.x);
    person.position.x = 2 * person.radius - person.position.x;
  }
  else if (person.position.x + person.radius >= animationCanvas.width) {
    person.velocity.x = -Math.abs(person.velocity.x);
    person.position.x = 2 * (animationCanvas.width - person.radius) - person.position.x;
  }

  if (person.position.y - person.radius <= 0) {
    person.velocity.y = Math.abs(person.velocity.y);
    person.position.y = 2 * person.radius - person.position.y;
  }
  else if (person.position.y + person.radius >= animationCanvas.height) {
    person.velocity.y = -Math.abs(person.velocity.y);
    person.position.y = 2 * (animationCanvas.height - person.radius) - person.position.y;
  }
}


function getDistance(person, otherPerson) {
  return Math.hypot(person.position.x - otherPerson.position.x, person.position.y - otherPerson.position.y)
}