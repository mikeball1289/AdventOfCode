import { memoize } from '../../../lib/funcs';
import { ints, openAoC } from '../../../lib/input/openAoC';
import { count, cross, range, sum, zip } from '../../../lib/math/settools';
import { CellularAutomaton } from '../../lib/CellularAutomaton';

const minus1to1 = range(-1, 2);
const neighborOffsets3d = cross(cross(minus1to1, minus1to1), minus1to1)
    .map(el => el.flat())
    .filter(c => c.some(v => v !== 0));

const neighborOffsets4d = cross(cross(cross(minus1to1, minus1to1), minus1to1).map(el => el.flat()), minus1to1)
    .map(el => el.flat())
    .filter(c => c.some(v => v !== 0));

type CellType = number[];
enum CellState {
    DEAD,
    ALIVE,
}
const neighbors3d = memoize((cell: CellType) => neighborOffsets3d.map(n => zip(n, cell).map(sum) as CellType));
const neighbors4d = memoize((cell: CellType) => neighborOffsets4d.map(n => zip(n, cell).map(sum) as CellType));
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

const game3d = new CellularAutomaton(
    neighbors3d,
    nextState,
    serialize,
    deserialize,
    CellState.DEAD,
    startingState3d,
);

const result3d = range(0, 6).reduce(ca => ca.step(), game3d);
console.log(count(Object.values(result3d.state), CellState.ALIVE)); // 295

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
console.log(count(Object.values(result4d.state), CellState.ALIVE)); // 1972
