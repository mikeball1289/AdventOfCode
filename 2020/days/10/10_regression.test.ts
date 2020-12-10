import { ints, openAoC } from '../../../lib/input/openAoC';
import { ascending, firstDifferences } from '../../../lib/math/settools';
import { countAlternativeSequences } from '../../lib/adapters';

describe('Day 10 - Adapter Array', () => {
    test('Part 1 solves', () => {
        const adapters = openAoC('./2020/input/day10input.txt', ['\n'], ints);

        const adapterChain = adapters.sort(ascending);
        // add in the wall and device joltage levels
        const sequence = [0, ...adapterChain, adapterChain.slice(-1)[0] + 3];
        const firstDiffs = firstDifferences(sequence);
        const joltGap1 = firstDiffs.filter(n => n === 1).length;
        const joltGap3 = firstDiffs.filter(n => n === 3).length;

        expect(joltGap1 * joltGap3).toBe(1885);
    });

    test('Part 2 solves', () => {
        const adapters = openAoC('./2020/input/day10input.txt', ['\n'], ints);

        const adapterChain = adapters.sort(ascending);

        // add in the wall and device joltage levels
        const sequence = [0, ...adapterChain, adapterChain.slice(-1)[0] + 3];
        const count = countAlternativeSequences(sequence);

        expect(count).toBe(2024782584832);
    });
});
