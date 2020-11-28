import { frameCount } from "../main.js";

export default class Person {
  constructor(positionX, positionY, velocityX, velocityY, radius, state) {
    this.position = {
      x: positionX,
      y: positionY
    }
    this.velocity = {
      x: velocityX,
      y: velocityY
    }
    this.radius = radius;
    this.state = state;
    this.stateChangeFrame = frameCount;
  }
  
  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  setState(state) {
    this.state = state;
    this.stateChangeFrame = frameCount;
  }
}