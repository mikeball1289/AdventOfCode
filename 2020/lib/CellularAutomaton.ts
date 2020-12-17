import { uniq } from '../../lib/math/settools';

export class CellularAutomaton<CellLabel, CellState> {
    constructor(
        public readonly neighbors: (cell: CellLabel) => CellLabel[],
        public readonly nextState: (currentState: CellState, neighbors: CellState[]) => CellState,
        public readonly serialize: (label: CellLabel) => string,
        public readonly deserialize: (label: string) => CellLabel,
        public readonly defaultState: CellState,
        public readonly state: { [label: string]: CellState } = {},
    ) { }

    step(): CellularAutomaton<CellLabel, CellState> {
        const existingCellLabels = Object.keys(this.state);
        const existingCells = existingCellLabels.map(cell => this.deserialize(cell));
        const cellNeighbors = uniq(existingCells.flatMap(cell => this.neighbors(cell)).map(cell => this.serialize(cell)));
        const relevantCells = uniq([
            ...existingCellLabels,
            ...cellNeighbors,
        ]);

        const nextWorldState = relevantCells.reduce((state: { [label: string]: CellState }, label) => {
            const currentCell = this.deserialize(label);
            const neighbors = this.neighbors(currentCell).map(n => this.serialize(n));
            const neighborStates = neighbors.map(cell => this.getCellState(cell));
            const currentState = this.getCellState(label);
            const nextState = this.nextState(currentState, neighborStates);
            if (nextState === this.defaultState) {
                return state;
            }
            return {
                ...state,
                [label]: nextState,
            };
        }, {});

        return new CellularAutomaton(
            this.neighbors,
            this.nextState,
            this.serialize,
            this.deserialize,
            this.defaultState,
            nextWorldState,
        );
    }

    private getCellState(label: string) {
        return this.state.hasOwnProperty(label) ? this.state[label] : this.defaultState;
    }
}
