export class Point {
    constructor(public readonly x: number = 0, public readonly y: number = 0) { }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y;
    }

    isOrigin() {
        return this.x === 0 && this.y === 0;
    }

    get manhattanDistance() {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    rotateLeft() {
        return new Point(-this.y, this.x);
    }

    rotateRight() {
        return new Point(this.y, -this.x);
    }
}
