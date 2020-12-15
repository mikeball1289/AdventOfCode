import { openAoC } from '../../../lib/input/openAoC';
import { sum } from '../../../lib/math/settools';
import { applyMask, applyMemoryMask, groupByMask, MaskMemory } from '../../lib/MaskMemory';

describe('Day 14 - Docking Data', () => {
    test('Part 1 solves', () => {
        const commands = openAoC('./2020/input/day14input.txt', ['\n', ' = ']);

        const lastSetMemory = commands
            .slice()
            .reverse()
            .filter((c, i, cs) => c[0] === 'mask' || cs.findIndex(ci => c[0] === ci[0]) === i)
            .reverse();

        const maskSets = groupByMask(lastSetMemory);

        const memSets = maskSets.flatMap(ms => ms.lines.map(l => applyMask(ms.mask, l.value)));

        expect(sum(memSets)).toBe(7817357407588);
    });

    test('Part 2 solves', () => {
        const commands = openAoC('./2020/input/day14input.txt', ['\n', ' = ']);

        const maskMemory = groupByMask(commands)
            .reduce((mem: MaskMemory, ms) =>
                ms.lines.reduce((mm: MaskMemory, line) =>
                    mm.insert(applyMemoryMask(ms.mask, line.mem), line.value),
                    mem),
                MaskMemory.EMPTY);

        expect(maskMemory.sumContents()).toBe(4335927555692);
    });
});
