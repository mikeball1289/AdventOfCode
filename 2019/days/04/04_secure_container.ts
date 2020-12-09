import { sat } from '../../../lib/funcs';
import { blocks, eq, range, zip } from '../../../lib/math/settools';
import { digits } from '../../../lib/math/tools';

const inputMin = 128392;
const inputMax = 643281;

const inputRange = range(inputMin, inputMax + 1);

function twoAdjactentDigitsAreTheSame(n: number) {
    const digs = digits(n);
    return zip(digs, digs.slice(1)).some(eq);
}

function digitsNeverDecrease(n: number) {
    const digs = digits(n);
    return !zip(digs, digs.slice(1)).some(([a, b]) => a > b);
}

const firstPartChecker = sat([twoAdjactentDigitsAreTheSame, digitsNeverDecrease]);
console.log(inputRange.filter(firstPartChecker).length); // 2050

function exactlyTwoAdjacentDigitsAreTheSame(n: number) {
    const digs = digits(n);
    return blocks(digs).some(block => block.len === 2);
}

const secondPartChecker = sat([exactlyTwoAdjacentDigitsAreTheSame, digitsNeverDecrease]);
console.log(inputRange.filter(secondPartChecker).length); // 1390
