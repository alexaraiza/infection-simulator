import { HEALTHY_COLOR, INFECTED_COLOR, IMMUNE_COLOR } from "../settings.js";


const context = animationCanvas.getContext("2d");


export function draw(people) {
  for (let person of people) {
    context.beginPath();
    context.arc(person.position.x, person.position.y, person.radius, 0, 2 * Math.PI);

    switch (person.state) {
      case "healthy":
        context.fillStyle = HEALTHY_COLOR;
        break;
      case "infected":
        context.fillStyle = INFECTED_COLOR;
        break;
      case "immune":
        context.fillStyle = IMMUNE_COLOR;
    }
    context.fill();
  }
}

export function erase(people) {
  for (let person of people) {
    context.beginPath();
    context.arc(person.position.x, person.position.y, person.radius + 1, 0, 2 * Math.PI);
    context.fillStyle = getComputedStyle(animationCanvas).backgroundColor;
    context.fill();
  }
}

export function clear() {
  context.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
}


export function resize() {
  animationCanvas.height = window.innerHeight - 320;
  animationCanvas.width = 0.6 * window.innerWidth;
}