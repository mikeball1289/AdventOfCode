export class Map2d<T> {
    constructor(private readonly data: T[][]) {
        if (data.length === 0) {
            throw new Error('data must have at least one row');
        }
        if (data.some(row => row.length !== data[0].length)) {
            throw new Error('data must be rectangular');
        }
    }

    get width() {
        return this.data[0].length;
    }

    get height() {
        return this.data.length;
    }

    get(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            throw new RangeError(`Index (${x}, ${y}) is out of range (${this.width}, ${this.height})`);
        }
        return this.data[y][x];
    }

    set(x: number, y: number, value: T) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            throw new RangeError(`Index (${x}, ${y}) is out of range (${this.width}, ${this.height})`);
        }
        return new Map2d(this.data.map((row, ry) => ry !== y ? row : row.map((cell, cx) => cx !== x ? cell : value)));
    }

    map<V>(mapping: (el: T, x: number, y: number, map: Map2d<T>) => V): Map2d<V> {
        return new Map2d(this.data.map((row, ry) => row.map((cell, cx) => mapping(cell, cx, ry, this))));
    }

    toString() {
        return this.data.map(row => row.join('')).join('\n');
    }

    values() {
        return this.data.flat();
    }
}
