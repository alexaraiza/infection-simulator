import Person from "./Person.js";
import { personInitialSpeed, personRadius, infectedFrames, immuneFrames } from "../settings.js";
import { walls } from "../walls/walls.js";
import { drawPeople, erasePeople, clearPeople } from "../animations/canvas.js";


export const people = [];
export let hoveringPerson = null;


export const count = {
  total: 0,
  healthy: 0,
  infected: 0,
  immune: 0,
  dailyCollisions: 0,
  dailyInfections: 0,
  dailyReset: function() {
    for (let key of COUNT_DAILY_KEYS) {
      this[key] = 0;
    }
  },
  reset: function() {
    for (let key of COUNT_KEYS) {
      this[key] = 0;
    }
  }
}

const COUNT_KEYS = Object.keys(count).filter(key => typeof(count[key]) !== 'function');
const COUNT_DAILY_KEYS = COUNT_KEYS.filter(key => key.startsWith("daily"));


export const countHistory = {
  days: [0],
  total: [],
  healthy: [],
  infected: [],
  immune: [],
  dailyCollisions: [],
  dailyInfections: [],
  addCurrentCount: function() {
    this.days.push(this.days.length);
    for (let key of COUNT_HISTORY_KEYS_WITHOUT_DAYS) {
      this[key].push(count[key]);
    }
  },
  setLastCount: function() {
    for (let key of COUNT_HISTORY_PERSON_KEYS) {
      this[key][0] = count[key];
    }
  },
  reset: function() {
    for (let key of COUNT_HISTORY_KEYS) {
      this[key].splice(0);
    }
    this.days.push(0);
  }
}

const COUNT_HISTORY_KEYS = Object.keys(countHistory).filter(key => typeof(countHistory[key]) !== 'function');
const COUNT_HISTORY_KEYS_WITHOUT_DAYS = COUNT_HISTORY_KEYS.filter(key => key !== "days");
const COUNT_HISTORY_PERSON_KEYS = COUNT_HISTORY_KEYS_WITHOUT_DAYS.filter(key => !key.startsWith("daily"));


export function move() {
  for (let person of people) {
    person.move();
  }
}


export function collide() {
  for (let person of people) {
    collideWithWalls(person, walls);
  }
  collidePeople();
}


export function add(n, state) {
  let addedPeople = [];

  for (var addedCount = 0; addedCount < n; addedCount++) {
    let tries = 0;
    let createdPerson;
    let personIsValid;

    do {
      let velocityAngle = 2 * Math.PI * Math.random();
      createdPerson = new Person(personRadius + Math.random() * (animationCanvas.width - 2 * personRadius), personRadius + Math.random() * (animationCanvas.height - 2 * personRadius), personInitialSpeed * Math.cos(velocityAngle), personInitialSpeed * Math.sin(velocityAngle), personRadius, state);
      personIsValid = true;

      for (let existingPerson of people) {
        if (areColliding(createdPerson, existingPerson)) {
          personIsValid = false;
          break;
        }
      }
    }
    while (!personIsValid && ++tries < 1000);

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


export function removeAllPeople() {
  people.splice(0);
  count.reset();
  countHistory.reset();
  clearPeople();
}


export function checkStateChange(frameCount) {
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


export function hoverMouse(x, y) {
  if (people.length === 0) return;

  let closestPerson;
  let closestDistance;

  for (let person of people) {
    let distance = Math.hypot(person.position.x - x, person.position.y - y);
    if (!closestPerson) {
      closestPerson = person;
      closestDistance = distance;
    }
    else if (distance < closestDistance) {
      closestPerson = person;
      closestDistance = distance;
    }
  }

  if ((closestDistance > 2 * closestPerson.radius || closestPerson !== hoveringPerson) && hoveringPerson) {
    unhoverPeople();
  }

  if (closestDistance <= 2 * closestPerson.radius && !hoveringPerson) {
    hoverPerson(closestPerson);
  }
}


export function redrawPeople() {
  clearPeople();
  drawPeople(people);
}


function hoverPerson(person) {
  erasePeople([person]);
  hoveringPerson = person;
  drawPeople([person]);
}


export function unhoverPeople() {
  if (hoveringPerson) {
    erasePeople([hoveringPerson]);
    let person = hoveringPerson;
    hoveringPerson = null;
    drawPeople([person]);
  }
}




function collidePeople() {
  for (let i = 0; i < people.length; i++) {
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
          sine * iNormalVelocity - cosine * jTangentialVelocity
        ];

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
}


function collideWithWalls(person, walls) {
  collideWithExteriorWalls(person);
  collideWithInteriorWalls(person, walls);
}


function collideWithExteriorWalls(person) {
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


function collideWithInteriorWalls(person) {
  for (let wall of walls) {
    if (wall.length === 0) {
      collideWithWallPoint(person, wall, "start");
      continue;
    }

    let sine = wall.dy / wall.length;
    let cosine = wall.dx / wall.length;

    let normalDistance = sine * (person.position.x - wall.start.x) - cosine * (person.position.y - wall.start.y);
    let tangentialDistance = cosine * (person.position.x - wall.start.x) + sine * (person.position.y - wall.start.y);

    if (Math.abs(normalDistance) <= person.radius + wall.thickness / 2 && 0 <= tangentialDistance && tangentialDistance <= wall.length) {
      let normalVelocity = sine * person.velocity.x - cosine * person.velocity.y;
      let tangentialVelocity = cosine * person.velocity.x + sine * person.velocity.y;

      if (normalDistance * normalVelocity >= 0) continue;

      [person.velocity.x, person.velocity.y] = [
        - sine * normalVelocity + cosine * tangentialVelocity,
        cosine * normalVelocity + sine * tangentialVelocity
      ];

      continue;
    }

    if (collideWithWallPoint(person, wall, "start")) continue;
    if (collideWithWallPoint(person, wall, "end")) continue;
  }
}


function collideWithWallPoint(person, wall, pointString) {
  let xDistanceToPoint = wall[pointString].x - person.position.x;
  let yDistanceToPoint = wall[pointString].y - person.position.y;
  let totalDistanceToPoint = Math.hypot(xDistanceToPoint, yDistanceToPoint);

  if (totalDistanceToPoint <= (person.radius + wall.thickness / 2)) {
    let sine = yDistanceToPoint / totalDistanceToPoint;
    let cosine = xDistanceToPoint / totalDistanceToPoint;

    let normalVelocity = cosine * person.velocity.x + sine * person.velocity.y;
    let tangentialVelocity = sine * person.velocity.x - cosine * person.velocity.y;

    if (normalVelocity <= 0) return true;

    [person.velocity.x, person.velocity.y] = [
      - cosine * normalVelocity + sine * tangentialVelocity,
      - sine * normalVelocity - cosine * tangentialVelocity
    ];

    return true;
  }
  return false;
}


function areColliding(person, otherPerson) {
  return Math.hypot(person.position.x - otherPerson.position.x, person.position.y - otherPerson.position.y) <= (person.radius + otherPerson.radius);
}