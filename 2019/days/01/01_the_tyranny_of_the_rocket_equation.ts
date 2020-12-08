import { openAoC } from '../../../lib/input/openAoC';
import { converge } from '../../../lib/math/funcs';
import { sum } from '../../../lib/math/settools';

const input = openAoC('./2019/input/day1input.txt', ['\n']);
const nums = input.map(n => parseInt(n, 10));

function computeRequiredFuel(mass: number) {
    return Math.max(0, Math.floor(mass / 3) - 2);
}

const fuelAmounts = nums.map(computeRequiredFuel);
console.log(sum(fuelAmounts)); // 3305041

interface AdditionalFuel {
    totalFuel: number;
    addedFuel: number;
}

function addFuel(fuel: AdditionalFuel): AdditionalFuel {
    return {
        totalFuel: fuel.totalFuel + fuel.addedFuel,
        addedFuel: computeRequiredFuel(fuel.addedFuel),
    };
}

const correctFuelAmounts = nums
    .map(n => converge(
        addFuel,
        { totalFuel: 0, addedFuel: computeRequiredFuel(n) },
        (a, b) => a.totalFuel === b.totalFuel,
    ).totalFuel);

console.log(sum(correctFuelAmounts)); // 4954710
