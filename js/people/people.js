import Person from "./Person.js";
import { frameCount } from "../main.js";
import { personInitialSpeed, personRadius, infectedFrames, immuneFrames } from "../settings.js";
import { hoverPerson, unhoverPerson } from "../animations/canvas.js";


export const people = [];
export let personHovering = null;

export const count = {
  "total": 0,
  "healthy": 0,
  "infected": 0,
  "immune": 0,
  "dailyCollisions": 0,
  "dailyInfections": 0,
  reset: function() {
    for (let key in count) {
      if (key.startsWith("daily")) {
        this[key] = 0;
      }
    }
  }
}

export const countHistory = {
  "days": [0],
  "total": [],
  "healthy": [],
  "infected": [],
  "immune": [],
  "dailyCollisions": [],
  "dailyInfections": [],
  addCurrentCount: function() {
    this.days.push(this.days.length);

    for (let key in count) {
      if (typeof count[key] === "number") {
        this[key].push(count[key]);
      }
    }
  },
  setInitialCount: function() {
    const KEYS = ["total", "healthy", "infected", "immune"];
    for (let key of KEYS) {
      this[key][0] = count[key];
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
      let velocityAngle = 2 * Math.PI * Math.random();
      var createdPerson = new Person(personRadius + Math.random() * (animationCanvas.width - 2 * personRadius), personRadius + Math.random() * (animationCanvas.height - 2 * personRadius), personInitialSpeed * Math.cos(velocityAngle), personInitialSpeed * Math.sin(velocityAngle), personRadius, state);
      var personIsValid = true;

      for (let existingPerson of people) {
        if (areColliding(createdPerson, existingPerson)) {
          personIsValid = false;
          break;
        }
      }

      tries++
    }
    while (!personIsValid && tries < 1000);

    if (personIsValid) {
      people.push(createdPerson);
      addedPeople.push(createdPerson);
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
      removedPeople.push(people.splice(i, 1)[0]);
      removedCount++;
    }
    i--;
  }

  count[state] -= removedCount;
  count.total -= removedCount;

  return removedPeople;
}


export function removeExcessPeople(excessPeople, incomingState) {
  if (excessPeople <= 0) return [];

  const PRIORITIES = {
    "healthy": ["immune", "infected"],
    "infected": ["healthy", "immune"],
    "immune": ["healthy", "infected"]
  }

  let firstPriority = PRIORITIES[incomingState][0];
  let secondPriority = PRIORITIES[incomingState][1];

  let firstPriorityCount = count[firstPriority];

  if (firstPriorityCount >= excessPeople) {
    return remove(excessPeople, firstPriority);
  }
  else {
    let removedPeople = remove(firstPriorityCount, firstPriority);
    return removedPeople.concat(remove(excessPeople - firstPriorityCount, secondPriority));
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

      count.dailyCollisions++;

      [people[i].velocity.x, people[i].velocity.y, people[j].velocity.x, people[j].velocity.y] = [
        cosine * jNormalVelocity + sine * iTangentialVelocity,
        sine * jNormalVelocity - cosine * iTangentialVelocity,
        cosine * iNormalVelocity + sine * jTangentialVelocity,
        sine * iNormalVelocity - cosine * jTangentialVelocity];

      if (people[i].state === "healthy" && people[j].state === "infected") {
        people[i].setState("infected");
        count.healthy--;
        count.infected++;
        count.dailyInfections++;
      }
      else if (people[i].state === "infected" && people[j].state === "healthy") {
        people[j].setState("infected");
        count.healthy--;
        count.infected++;
        count.dailyInfections++;
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


export function checkMouseHover(event) {
  let mouseX = event.clientX - animationCanvas.offsetLeft;
  let mouseY = event.clientY - animationCanvas.offsetTop;
  let closestPerson;
  let closestDistance;

  for (let person of people) {
    let distance = Math.hypot(person.position.x - mouseX, person.position.y - mouseY);
    if (!closestPerson) {
      closestPerson = person;
      closestDistance = distance;
    }
    else if (distance < closestDistance) {
      closestPerson = person;
      closestDistance = distance;
    }
  }

  if ((closestDistance > 2 * closestPerson.radius || closestPerson !== personHovering) && personHovering) {
    unhoverPerson(personHovering);
    personHovering = null;
  }

  if (closestDistance <= 2 * closestPerson.radius && !personHovering) {
    hoverPerson(closestPerson);
    personHovering = closestPerson;
  }
}


function areColliding(person, otherPerson) {
  return Math.hypot(person.position.x - otherPerson.position.x, person.position.y - otherPerson.position.y) <= (person.radius + otherPerson.radius)
}