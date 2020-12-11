import { Map2d } from '../../lib/Map2d';
import { count, cross, range } from '../../lib/math/settools';

export enum SeatCell {
    FLOOR = '.',
    EMPTY_SEAT = 'L',
    FILLED_SEAT = '#',
}

export function seatCellChar(char: string): SeatCell {
    if (!Object.values(SeatCell).includes(char as SeatCell)) {
        throw new Error(`"${char}" isn't a valid seat cell state.`);
    }
    return char as SeatCell;
}

type Unit = -1 | 0 | 1;
const allDirections: [Unit, Unit][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

export class SeatCA {
    constructor(public readonly cells: Map2d<SeatCell>) { }

    neighbors(x: number, y: number): SeatCell[] {
        const seed = cross(range(x - 1, x + 2), range(y - 1, y + 2));
        const neighborCoords = seed
            .filter(([sx, sy]) => sx !== x || sy !== y)
            .filter(([sx, sy]) => sx >= 0 && sx < this.cells.width && sy >= 0 && sy < this.cells.height);

        return neighborCoords.map(coords => this.cells.get(...coords));
    }

    private lineOfSight(x: number, y: number, direction: [Unit, Unit]): SeatCell {
        try {
            const sightCell = this.cells.get(x + direction[0], y + direction[1]);
            if (sightCell !== SeatCell.FLOOR) {
                return sightCell;
            }
            return this.lineOfSight(x + direction[0], y + direction[1], direction);
        } catch (err) {
            return SeatCell.FLOOR; // if the line of sight goes off the grid, just say you see the floor
        }
    }

    linesOfSight(x: number, y: number): SeatCell[] {
        return allDirections.map(d => this.lineOfSight(x, y, d));
    }

    stepAdjacent() {
        return new SeatCA(this.cells.map((cell, x, y) => {
            if (cell === SeatCell.FLOOR) return cell;

            const neighbors = this.neighbors(x, y);
            if (cell === SeatCell.EMPTY_SEAT && !neighbors.includes(SeatCell.FILLED_SEAT)) {
                return SeatCell.FILLED_SEAT;
            }
            if (cell === SeatCell.FILLED_SEAT && count(neighbors, SeatCell.FILLED_SEAT) >= 4) {
                return SeatCell.EMPTY_SEAT;
            }

            return cell;
        }));
    }

    stepLineOfSight() {
        return new SeatCA(this.cells.map((cell, x, y) => {
            if (cell === SeatCell.FLOOR) return cell;

            const linesOfSight = this.linesOfSight(x, y);
            if (cell === SeatCell.EMPTY_SEAT && !linesOfSight.includes(SeatCell.FILLED_SEAT)) {
                return SeatCell.FILLED_SEAT;
            }
            if (cell === SeatCell.FILLED_SEAT && count(linesOfSight, SeatCell.FILLED_SEAT) >= 5) {
                return SeatCell.EMPTY_SEAT;
            }

            return cell;
        }));
    }
}
