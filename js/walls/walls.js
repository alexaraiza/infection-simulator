import Wall from "./Wall.js";
import { mouseIsDown } from "../main.js";
import { drawWalls, clearWalls } from "../animations/canvas.js";


export const walls = [];
export let wallHovering = null;
let wallInConstruction = null;


export function newWall(x, y, thickness) {
  wallHovering = wallInConstruction = new Wall(x, y, thickness);
  redrawWalls(walls.concat(wallInConstruction));
}


export function deleteWallInConstruction() {
  wallHovering = wallInConstruction = null;
  redrawWalls(walls);
}


export function editWall(mouseX, mouseY) {
  if (mouseIsDown) {
    wallInConstruction.drag(mouseX, mouseY);
  }
  else {
    wallInConstruction.move(mouseX, mouseY);
  }
  redrawWalls(walls.concat(wallInConstruction));
}


export function placeWall() {
  wallInConstruction.place();
  walls.push(wallInConstruction);
  wallHovering = wallInConstruction = null;
  redrawWalls(walls);
}


export function removeWall() {
  if (!wallHovering) return;
  walls.splice(walls.indexOf(wallHovering), 1);
  redrawWalls(walls);
}


export function checkMouseHover(mouseX, mouseY) {
  let closestWall;
  let closestDistance;

  for (let wall of walls) {
    let distance;

    if (wall.length === 0) {
      distance = Math.hypot(wall.start.x - mouseX, wall.start.y - mouseY);
    }
    else {
      let sine = wall.dy / wall.length;
      let cosine = wall.dx / wall.length;
      let tangentialDistance = cosine * (mouseX - wall.start.x) + sine * (mouseY - wall.start.y);

      if (tangentialDistance < 0) {
        distance = Math.hypot(wall.start.x - mouseX, wall.start.y - mouseY);
      }
      else if (tangentialDistance > wall.length) {
        distance = Math.hypot(wall.end.x - mouseX, wall.end.y - mouseY);
      }
      else {
        distance = Math.abs(sine * (mouseX - wall.start.x) - cosine * (mouseY - wall.start.y));
      }
    }

    if (!closestWall) {
      closestWall = wall;
      closestDistance = distance;
    }
    else if (distance < closestDistance) {
      closestWall = wall;
      closestDistance = distance;
    }
  }
  if (typeof(closestWall) === "undefined") return;

  if ((closestDistance > closestWall.thickness || closestWall !== wallHovering) && wallHovering) {
    unhoverWalls();
  }

  if (closestDistance <= closestWall.thickness && !wallHovering) {
    hoverWall(closestWall);
  }
}




function redrawWalls(walls) {
  clearWalls();
  drawWalls(walls);
}


function hoverWall(wall) {
  wallHovering = wall;
  redrawWalls(walls);
}


function unhoverWalls() {
  wallHovering = null;
  redrawWalls(walls);
}