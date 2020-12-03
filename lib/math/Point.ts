export class Point {
    constructor(public readonly x: number = 0, public readonly y: number = 0) { }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y;
    }
}
