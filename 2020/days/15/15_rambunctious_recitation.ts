import { last } from '../../../lib/math/settools';
import { NumberGame } from '../../lib/NumberGame';

const input = [9, 12, 1, 4, 17, 0, 18];

const game = NumberGame.fromStart(input);

console.log(last(game.playUntilTime(2020).numberHistory)); // 610

// Part two is solved in C, because a pure functional solution results in a heap error
// and I don't want impure TS code in here
// see 15_rambunctious_recitation.c // 1407
// Here is a reasonably optimized TS version
/*
const timeUpTo = 30000000;

const lastSeen = new Array(timeUpTo).fill(0);
let time = 1;

while (input[time] >= 0) {
    lastSeen[input[time - 1]] = time;
    time++;
}
let lastNumber = input[time - 1];

while (time < timeUpTo) {
    if (time % 100000 === 0) {
        console.log(`(${(time / timeUpTo * 100).toFixed(1)}%) Working on range ${time} - ${time + 99999}`);
    }
    const lastNumberSeen = lastSeen[lastNumber];
    const nextNumber = lastNumberSeen === 0 ? 0 : time - lastNumberSeen;
    lastSeen[lastNumber] = time;
    lastNumber = nextNumber;
    time++;
}

console.log(`${time}th number: ${lastNumber}`);
*/
