import { openAoC } from '../../../lib/input/openAoC';
import { converge } from '../../../lib/math/funcs';
import { sum } from '../../../lib/math/settools';

describe('Day 1 - The Tyranny of the Rocket Equation', () => {
    function computeRequiredFuel(mass: number) {
        return Math.max(0, Math.floor(mass / 3) - 2);
    }

    test('Part 1 solves', () => {
        const input = openAoC('./2019/input/day1input.txt', ['\n']);
        const nums = input.map(n => parseInt(n, 10));

        const fuelAmounts = nums.map(computeRequiredFuel);
        expect(sum(fuelAmounts)).toBe(3305041);
    });

    test('Part 2 solves', () => {
        const input = openAoC('./2019/input/day1input.txt', ['\n']);
        const nums = input.map(n => parseInt(n, 10));

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

        expect(sum(correctFuelAmounts)).toBe(4954710);
    });
});
