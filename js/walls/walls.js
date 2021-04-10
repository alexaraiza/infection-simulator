import Wall from "./Wall.js";
import { wallThickness } from "../settings.js";
import { drawWalls, clearWalls } from "../animations/canvas.js";


export const walls = [];
export let hoveringWall = null;
let wallInConstruction = null;


export function newWall(x, y) {
  hoveringWall = wallInConstruction = new Wall(x, y, wallThickness);
  redrawWalls(walls.concat(wallInConstruction));
}


export function deleteWallInConstruction() {
  hoveringWall = wallInConstruction = null;
  redrawWalls(walls);
}


export function editWall(x, y, mouseIsDown) {
  if (!wallInConstruction) return;
  if (mouseIsDown) {
    wallInConstruction.drag(x, y);
  }
  else {
    wallInConstruction.move(x, y);
  }
  redrawWalls(walls.concat(wallInConstruction));
}


export function placeWall() {
  if (!wallInConstruction) return;
  wallInConstruction.place();
  walls.push(wallInConstruction);
  hoveringWall = wallInConstruction = null;
  redrawWalls(walls);
}


export function removeAllWalls() {
  walls.splice(0);
  redrawWalls(walls);
}


export function removeHoveringWall() {
  if (!hoveringWall) return;
  walls.splice(walls.indexOf(hoveringWall), 1);
  redrawWalls(walls);
}


export function hoverMouse(x, y) {
  if (walls.length === 0) return;

  let closestWall;
  let closestDistance;

  for (let wall of walls) {
    let distance;

    if (wall.length === 0) {
      distance = Math.hypot(wall.start.x - x, wall.start.y - y);
    }
    else {
      let sine = wall.dy / wall.length;
      let cosine = wall.dx / wall.length;
      let tangentialDistance = cosine * (x - wall.start.x) + sine * (y - wall.start.y);

      if (tangentialDistance < 0) {
        distance = Math.hypot(wall.start.x - x, wall.start.y - y);
      }
      else if (tangentialDistance > wall.length) {
        distance = Math.hypot(wall.end.x - x, wall.end.y - y);
      }
      else {
        distance = Math.abs(sine * (x - wall.start.x) - cosine * (y - wall.start.y));
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

  if (hoveringWall && (closestDistance > closestWall.thickness || closestWall !== hoveringWall)) {
    unhoverWalls();
  }

  if (closestDistance <= closestWall.thickness && !hoveringWall) {
    hoverWall(closestWall);
  }
}




function redrawWalls(walls) {
  clearWalls();
  drawWalls(walls);
}


function hoverWall(wall) {
  hoveringWall = wall;
  redrawWalls(walls);
}


function unhoverWalls() {
  hoveringWall = null;
  redrawWalls(walls);
}