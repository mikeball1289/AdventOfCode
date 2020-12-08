import { Point } from './math/Point';
import { range } from './math/settools';

export class TreeField {
    constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly trees: Point[],
    ) {
        const oobTree = trees.find(t => t.x < 0 || t.x >= width || t.y < 0 || t.y >= height);
        if (oobTree) {
            throw new RangeError(`Tree ${oobTree.toString()} is outside bounds ${width} x ${height}`);
        }
    }

    static fromText(fieldString: string): TreeField {
        // trim blank lines
        const lines = fieldString.split('\n').filter(l => l !== '');
        if (lines.some(l => l.length !== lines[0].length)) {
            throw new Error('Input text must be rectangular');
        }

        const treeLines = lines.map(l => l.split('')
            .map((c, i) => [c, i] as [string, number])
            .filter(([c]) => c === '#')
            .map(([_, i]) => i)
        );

        const trees = treeLines.flatMap((l, y) => l.map(x => new Point(x, y)));

        return new TreeField(lines[0].length, lines.length, trees);
    }

    collisions(trajectory: Point): number {
        // generate the steps that exist along the given trajectory
        // first get the vertical steps, then compute the related horizontal step
        const steps = range(0, this.height, trajectory.y)
            .map((y, i) => new Point((i * trajectory.x) % this.width, y));

        return steps.filter(step => this.trees.some(tree => tree.equals(step))).length;
    }
}
