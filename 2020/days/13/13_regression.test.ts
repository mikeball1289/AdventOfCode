import { ints, openAoC } from '../../../lib/input/openAoC';
import { minBy, reduction, sum } from '../../../lib/math/settools';
import { lcm, modDivide } from '../../../lib/math/tools';

describe('Day 13 - Shuttle Search', () => {
    test('Part 1 solves', () => {
        const [[currentTime], schedules] = openAoC('./2020/input/day13input.txt', ['\n', ','], ints);

        const realSchedules = schedules.filter(n => !isNaN(n));
        const nextDeparture = minBy(realSchedules, n => n - (currentTime % n));
        const leavingIn = nextDeparture - (currentTime % nextDeparture);

        expect(nextDeparture * leavingIn).toBe(156);
    });

    test('Part 2 solves', () => {
        const [, schedules] = openAoC('./2020/input/day13input.txt', ['\n', ','], ints);

        function getPart(index: number, prod: number, cons: number) {
            const factor = prod / cons;
            return factor * modDivide(cons - index, factor, cons);
        }

        const totalProduct = reduction(schedules.filter(s => !isNaN(s)), lcm);
        const parts = schedules.map((s, i) => isNaN(s) ? 0 : getPart(i, totalProduct, s));
        expect(sum(parts) % totalProduct).toBe(404517869995362);
    });
});
