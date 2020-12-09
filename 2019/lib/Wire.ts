import { Point } from '../../lib/math/Point';
import { sum } from '../../lib/math/settools';
import { isBetween } from '../../lib/math/tools';

export enum WireDirection {
    HORIZONTAL,
    VERTICAL,
}

export class Wire {
    public readonly end: Point;

    constructor(
        public readonly start: Point,
        public readonly direction: WireDirection,
        public readonly length: number,
    ) {
        this.end = direction === WireDirection.HORIZONTAL ?
            new Point(start.x + length, start.y) :
            new Point(start.x, start.y + length);
    }

    static fromText(wireText: string, startPoint: Point) {
        const direction = wireText.slice(0, 1);
        const length = parseInt(wireText.slice(1), 10);
        if (!['U', 'D', 'L', 'R'].includes(direction) || isNaN(length)) {
            throw new Error(`Invalid wire text ${wireText}`);
        }

        const adjustedLength = ['D', 'L'].includes(direction) ?
            -length :
            length;

        return ['L', 'R'].includes(direction) ?
            new Wire(startPoint, WireDirection.HORIZONTAL, adjustedLength) :
            new Wire(startPoint, WireDirection.VERTICAL, adjustedLength);
    }

    get perpendicularCoord() {
        return this.direction === WireDirection.HORIZONTAL ? this.start.y : this.start.x;
    }

    get parallelCoord() {
        return this.direction === WireDirection.HORIZONTAL ? this.start.x : this.start.y;
    }

    intersection(other: Wire) {
        if (other.direction === this.direction) return undefined; // parallel wires never intersect
        if (
            isBetween(this.perpendicularCoord, [other.parallelCoord, other.parallelCoord + other.length]) &&
            isBetween(other.perpendicularCoord, [this.parallelCoord, this.parallelCoord + this.length])
        ) {
            return this.direction === WireDirection.HORIZONTAL ?
                new Point(other.perpendicularCoord, this.perpendicularCoord) :
                new Point(this.perpendicularCoord, other.perpendicularCoord);
        } else {
            return undefined;
        }
    }

    /**
     * Detect if the point is on the wire or not, return the distance along the wire to that point if it
     * is, and undefined if it isn't
     * @param point The point on the wire to look for
     */
    containsPoint(point: Point): number | undefined {
        const parallelPosition = this.direction === WireDirection.HORIZONTAL ? point.x : point.y;
        const perpendicularPosition = this.direction === WireDirection.HORIZONTAL ? point.y : point.x;

        // exit early if the point doesn't lie on the same line as the wire
        if (perpendicularPosition !== this.perpendicularCoord) {
            return undefined;
        }
        if (!isBetween(parallelPosition, [this.parallelCoord, this.parallelCoord + this.length])) {
            return undefined;
        }
        return Math.abs(parallelPosition - this.parallelCoord);
    }
}

export function parseWiresFromPath(wireParts: string[]) {
    return wireParts.reduce((wires: Wire[], part) =>
        [...wires, Wire.fromText(part, wires.slice(-1)[0]?.end ?? new Point())]
        , []);
}

export function distanceAlongPath(path: Wire[], position: Point): number | undefined {
    const indexWithPoint = path.findIndex(wire => wire.containsPoint(position) !== undefined);
    const result = path[indexWithPoint]?.containsPoint(position);
    if (indexWithPoint === undefined || result === undefined) {
        return undefined;
    }
    return sum(path.slice(0, indexWithPoint).map(wire => Math.abs(wire.length))) + result;
}
