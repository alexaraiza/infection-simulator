import { COLORS } from "../settings.js";
import { personHovering } from "../people/people.js";
import { wallHovering } from "../walls/walls.js";


const peopleContext = animationCanvas.getContext("2d");
const wallsContext = wallsCanvas.getContext("2d");


let canvasHeight = parseInt(window.innerHeight - 360);
let canvasWidth = parseInt(0.6 * window.innerWidth);
export let offsetLeft;
export let offsetTop;


export function drawPeople(people) {
  for (let person of people) {
    peopleContext.beginPath();
    peopleContext.arc(person.position.x, person.position.y, person.radius, 0, 2 * Math.PI);
    if (person === personHovering) {
      peopleContext.fillStyle = COLORS[person.state + "Hover"];
    }
    else {
      peopleContext.fillStyle = COLORS[person.state];
    }
    peopleContext.fill();
  }
}

export function erasePeople(people) {
  for (let person of people) {
    peopleContext.beginPath();
    peopleContext.arc(person.position.x, person.position.y, person.radius + 0.4, 0, 2 * Math.PI);
    peopleContext.fillStyle = getComputedStyle(animation).backgroundColor;
    peopleContext.fill();
  }
}


export function drawWalls(walls) {
  for (let wall of walls) {
    wallsContext.beginPath();
    wallsContext.moveTo(wall.start.x, wall.start.y);
    wallsContext.lineTo(wall.end.x, wall.end.y);
    wallsContext.lineWidth = wall.thickness;
    wallsContext.lineCap = "round";
    if (wall === wallHovering) {
      wallsContext.strokeStyle = COLORS["wall"] + "7f";
    }
    else {
      wallsContext.strokeStyle = COLORS["wall"];
    }
    wallsContext.stroke();
  }
}


export function clearPeople() {
  peopleContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

export function clearWalls() {
  wallsContext.clearRect(0, 0, canvasWidth, canvasHeight);
}


export function resize() {
  animation.style.height = canvasHeight + "px";
  animation.style.width = canvasWidth + "px";
  animationCanvas.height = canvasHeight;
  animationCanvas.width = canvasWidth;
  wallsCanvas.height = canvasHeight;
  wallsCanvas.width = canvasWidth;

  let animationRectangle = animation.getBoundingClientRect();
  offsetLeft = parseInt(animationRectangle.x);
  offsetTop = parseInt(animationRectangle.y);
}