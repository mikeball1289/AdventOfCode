import { readFileSync } from 'fs';
import { Point } from '../../lib/math/Point';
import { TreeField } from '../../lib/trees';

describe('Day 3 - Toboggan Trajectory', () => {
    test('Part 1 solves', () => {
        const input = readFileSync('./input/day3input.txt', 'ascii');

        const field = TreeField.fromText(input);
        const collisions = field.collisions(new Point(3, 1));

        expect(collisions).toBe(156);
    });

    test('Part 2 solves', () => {
        const input = readFileSync('./input/day3input.txt', 'ascii');

        const field = TreeField.fromText(input);
        const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].map(([x, y]) => new Point(x, y));

        const result = slopes.map(slope => field.collisions(slope)).reduce((prev, curr) => prev * curr, 1);
        expect(result).toBe(3521829480);
    });
});
