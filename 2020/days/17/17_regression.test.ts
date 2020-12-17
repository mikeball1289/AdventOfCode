import { memoize } from '../../../lib/funcs';
import { ints, openAoC } from '../../../lib/input/openAoC';
import { count, cross, range, sum, zip } from '../../../lib/math/settools';
import { CellularAutomaton } from '../../lib/CellularAutomaton';

type CellType = number[];
enum CellState {
    DEAD,
    ALIVE,
}

const minus1to1 = range(-1, 2);
const nextState = (currentState: CellState, neighborStates: CellState[]) => {
    const livingNeighbors = count(neighborStates, CellState.ALIVE);
    switch (livingNeighbors) {
        case 3: return CellState.ALIVE;
        case 2: return currentState;
        default: return CellState.DEAD;
    }
};
const serialize = (cell: CellType) => cell.join(',');
const deserialize = memoize((label: string) => label.split(',').map(ints));

describe('Day 17 - Conway Cubes', () => {
    test('Part 1 solves', () => {
        const neighborOffsets3d = cross(cross(minus1to1, minus1to1), minus1to1)
            .map(el => el.flat())
            .filter(c => c.some(v => v !== 0));

        const neighbors3d = memoize((cell: CellType) => neighborOffsets3d.map(n => zip(n, cell).map(sum) as CellType));

        const seed = openAoC('./2020/input/day17input.txt', ['\n', ''], c => c === '#' ? CellState.ALIVE : CellState.DEAD);

        const startingCells = seed
            .flatMap((r, x) => r.map((c, y) => [c, x, y] as [CellState, number, number]))
            .filter(([c]) => c === CellState.ALIVE)
            .map(([, x, y]) => [x, y]);

        const startingState3d = startingCells
            .reduce((state: { [label: string]: CellState }, cell) => ({
                ...state,
                [serialize([...cell, 0])]: CellState.ALIVE,
            }), {});

        const game = new CellularAutomaton(
            neighbors3d,
            nextState,
            serialize,
            deserialize,
            CellState.DEAD,
            startingState3d,
        );

        const result = range(0, 6).reduce(ca => ca.step(), game);
        expect(count(Object.values(result.state), CellState.ALIVE)).toBe(295);
    });

    // This part takes a while to run (about 40 seconds) and I can't be bothered to optimize right now
    test.skip('Part 2 solves', () => {
        const neighborOffsets4d = cross(cross(cross(minus1to1, minus1to1), minus1to1).map(el => el.flat()), minus1to1)
            .map(el => el.flat())
            .filter(c => c.some(v => v !== 0));

        const neighbors4d = memoize((cell: CellType) => neighborOffsets4d.map(n => zip(n, cell).map(sum) as CellType));

        const seed = openAoC('./2020/input/day17input.txt', ['\n', ''], c => c === '#' ? CellState.ALIVE : CellState.DEAD);

        const startingCells = seed
            .flatMap((r, x) => r.map((c, y) => [c, x, y] as [CellState, number, number]))
            .filter(([c]) => c === CellState.ALIVE)
            .map(([, x, y]) => [x, y]);

        const startingState4d = startingCells
            .reduce((state: { [label: string]: CellState }, cell) => ({
                ...state,
                [serialize([...cell, 0, 0])]: CellState.ALIVE,
            }), {});

        const game4d = new CellularAutomaton(
            neighbors4d,
            nextState,
            serialize,
            deserialize,
            CellState.DEAD,
            startingState4d,
        );

        const result4d = range(0, 6).reduce(ca => ca.step(), game4d);
        expect(count(Object.values(result4d.state), CellState.ALIVE)).toBe(1972);
    });
});
