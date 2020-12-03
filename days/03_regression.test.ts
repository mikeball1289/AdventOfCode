import { readFileSync } from 'fs';
import { Point } from '../lib/math/Point';
import { TreeField } from '../lib/trees';

describe('Day 3 - Toboggan Trajectory', () => {
    test('Part 1 solves', () => {
        const input = readFileSync('./input/day3input.txt', 'ascii');

        const field = TreeField.fromText(input);
        const collisions = field.collisions(new Point(3, 1));

        expect(collisions).toBe(156);
    });
});