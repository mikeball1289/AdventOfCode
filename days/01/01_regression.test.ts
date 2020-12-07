import { openAoC } from '../../lib/input/openAoC';
import { choose } from '../../lib/math/settools';

describe('Day 1 - Report Repair', () => {
    test('Part 1 solves', () => {
        const input = openAoC('./input/day1input.txt', ['\n']);
        const numbers = input.map(n => parseInt(n, 10));

        const relevantPairs = choose(numbers, 2).filter(([a, b]) => a + b === 2020);
        const answer = relevantPairs.map(([a, b]) => a * b);

        expect(answer).toStrictEqual([1016619]);
    });

    test('Part 2 solves', () => {
        const input = openAoC('./input/day1input.txt', ['\n']);
        const numbers = input.map(n => parseInt(n, 10));

        const relevantTriples = choose(numbers, 3).filter(([a, b, c]) => a + b + c === 2020);
        const answer = relevantTriples.map(([a, b, c]) => a * b * c);

        expect(answer).toStrictEqual([218767230]);
    });
});
