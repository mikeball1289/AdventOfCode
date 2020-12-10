import { ints, openAoC } from '../../../lib/input/openAoC';
import { choose, sum } from '../../../lib/math/settools';
import { findContinuousSubsetSum } from '../../lib/xmas-encryption';

describe('Day 9 - Encoding Error', () => {
    test('Part 1 solves', () => {
        const data = openAoC('./2020/input/day9input.txt', ['\n'], ints);

        const errors = data.filter((n, i) =>
            !(i < 25 || choose(data.slice(i - 25, i), 2).map(sum).includes(n))
        );

        expect(errors).toStrictEqual([21806024]);
    });

    test('Part 2 solves', () => {
        const data = openAoC('./2020/input/day9input.txt', ['\n'], ints);

        const results = findContinuousSubsetSum(data, 21806024).filter(s => s.length > 1);
        expect(results.map(r => Math.min(...r) + Math.max(...r))).toStrictEqual([2986195]);
    });
});
