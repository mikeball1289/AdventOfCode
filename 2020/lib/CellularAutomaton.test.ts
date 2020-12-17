import { memoize } from '../../lib/funcs';
import { ints } from '../../lib/input/openAoC';
import { count, cross, range, sum, zip } from '../../lib/math/settools';
import { CellularAutomaton } from './CellularAutomaton';

const minus1to1 = range(-1, 2);
const neighborOffsets = cross(minus1to1, minus1to1).filter(c => c[0] !== 0 || c[1] !== 0);
type CellType = [number, number];
enum CellState {
    DEAD,
    ALIVE,
}
const neighbors = memoize((cell: CellType) => neighborOffsets.map(n => zip(n, cell).map(sum) as CellType));
const nextState = (currentState: CellState, neighborStates: CellState[]) => {
    const livingNeighbors = count(neighborStates, CellState.ALIVE);
    switch (livingNeighbors) {
        case 3: return CellState.ALIVE;
        case 2: return currentState;
        default: return CellState.DEAD;
    }
};
const serialize = (cell: CellType) => cell.join(',');
const deserialize = memoize((label: string) => label.split(',').map(ints) as CellType);

describe('CellularAutomaton', () => {
    it('should construct with the given parameters', () => {
        const game = new CellularAutomaton(
            neighbors,
            nextState,
            serialize,
            deserialize,
            CellState.DEAD,
        );

        expect(game).toBeDefined();
    });

    it('should apply the rules of the cellular automaton as given', () => {
        const game = new CellularAutomaton(
            neighbors,
            nextState,
            serialize,
            deserialize,
            CellState.DEAD,
            {
                '0,-1': CellState.ALIVE,
                '1,0': CellState.ALIVE,
                '-1,1': CellState.ALIVE,
                '0,1': CellState.ALIVE,
                '1,1': CellState.ALIVE,
            }
        );

        expect(game.step().state).toStrictEqual({
            '-1,0': CellState.ALIVE,
            '1,0': CellState.ALIVE,
            '0,1': CellState.ALIVE,
            '1,1': CellState.ALIVE,
            '0,2': CellState.ALIVE,
        });

        expect(game.step().step().state).toStrictEqual({
            '1,0': CellState.ALIVE,
            '1,1': CellState.ALIVE,
            '-1,1': CellState.ALIVE,
            '0,2': CellState.ALIVE,
            '1,2': CellState.ALIVE,
        });
    });
});
