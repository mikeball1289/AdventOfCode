import { sat } from '../../../lib/funcs';
import { blocks, eq, range, zip } from '../../../lib/math/settools';
import { digits } from '../../../lib/math/tools';

function twoAdjactentDigitsAreTheSame(n: number) {
    const digs = digits(n);
    return zip(digs, digs.slice(1)).some(eq);
}

function digitsNeverDecrease(n: number) {
    const digs = digits(n);
    return !zip(digs, digs.slice(1)).some(([a, b]) => a > b);
}

function exactlyTwoAdjacentDigitsAreTheSame(n: number) {
    const digs = digits(n);
    return blocks(digs).some(block => block.len === 2);
}

describe('Day 4 - Secure Container', () => {
    test('Part 1 solves', () => {
        const inputMin = 128392;
        const inputMax = 643281;

        const inputRange = range(inputMin, inputMax + 1);

        const firstPartChecker = sat([twoAdjactentDigitsAreTheSame, digitsNeverDecrease]);
        expect(inputRange.filter(firstPartChecker).length).toBe(2050);
    });

    test('Part 2 solves', () => {
        const inputMin = 128392;
        const inputMax = 643281;

        const inputRange = range(inputMin, inputMax + 1);

        const secondPartChecker = sat([exactlyTwoAdjacentDigitsAreTheSame, digitsNeverDecrease]);
        expect(inputRange.filter(secondPartChecker).length).toBe(1390);
    });
});
