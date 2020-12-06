import { readFileSync } from 'fs';
import { uniq } from '../../lib/math/settools';

describe('Day 6 - Custom Customs', () => {
    test('Part 1 solves', () => {
        const input = readFileSync('./input/day6input.txt', 'ascii').replace(/\r\n/g, '\n');

        const forms = input.split('\n\n').filter(f => f !== '');

        // get the counts of unique answers in each form
        const results = forms
            // combine all of the answer letters into a single array
            .map(form => form.split('\n').join('').split(''))
            // filter duplicate responses
            .map(uniq)
            // count unique responses
            .map(result => result.length);

        const sumOfCounts = results.reduce((a, b) => a + b, 0);
        expect(sumOfCounts).toBe(6565);
    });

    test('Part 2 solves', () => {
        expect(true).toBe(false);
    });
});
