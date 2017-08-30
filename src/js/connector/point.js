export default class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  greaterThan (point) {
    return (this.y > point.y || this.x > point.x);
  }

  equals (point) {
    return (this.y === point.y && this.x === point.x);
  }

  clone () {
    return new Point(this.x, this.y);
  }
}
