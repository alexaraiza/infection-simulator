export default class Wall {
  constructor(x, y, thickness) {
    this.start = {
      x: x,
      y: y
    }
    this.end = {
      x: x,
      y: y
    }
    this.dx = 0;
    this.dy = 0;
    this.length = 0;
    this.thickness = thickness;
  }

  move(x, y) {
    this.start.x = x;
    this.start.y = y;
    this.end.x = x;
    this.end.y = y;
  }

  drag(x, y) {
    this.end.x = x;
    this.end.y = y;
  }

  place() {
    this.dx = this.end.x - this.start.x;
    this.dy = this.end.y - this.start.y;
    this.length = Math.hypot(this.dx, this.dy);
  }
}