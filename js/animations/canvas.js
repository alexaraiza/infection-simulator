import { COLORS } from "../settings.js";
import { personHovering } from "../people/people.js";


const context = animationCanvas.getContext("2d");


export function drawPeople(people) {
  for (let person of people) {
    context.beginPath();
    context.arc(person.position.x, person.position.y, person.radius, 0, 2 * Math.PI);
    if (person === personHovering) {
      context.fillStyle = COLORS[person.state + "Hover"];
    }
    else {
      context.fillStyle = COLORS[person.state];
    }
    context.fill();
  }
}

export function erasePeople(people) {
  for (let person of people) {
    context.beginPath();
    context.arc(person.position.x, person.position.y, person.radius + 0.4, 0, 2 * Math.PI);
    context.fillStyle = getComputedStyle(animationCanvas).backgroundColor;
    context.fill();
  }
}


export function hoverPerson(person) {
  erasePeople([person]);
  context.beginPath();
  context.arc(person.position.x, person.position.y, person.radius, 0, 2 * Math.PI);
  context.fillStyle = COLORS[person.state + "Hover"];
  context.fill();
}

export function unhoverPerson(person) {
  erasePeople([person]);
  context.beginPath();
  context.arc(person.position.x, person.position.y, person.radius, 0, 2 * Math.PI);
  context.fillStyle = COLORS[person.state];
  context.fill();
}


export function clear() {
  context.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
}


export function resize() {
  animationCanvas.height = window.innerHeight - 360;
  animationCanvas.width = 0.6 * window.innerWidth;
}