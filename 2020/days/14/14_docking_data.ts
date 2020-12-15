import { openAoC } from '../../../lib/input/openAoC';
import { sum } from '../../../lib/math/settools';
import { applyMask, applyMemoryMask, MaskMemory, groupByMask } from '../../lib/MaskMemory';

const commands = openAoC('./2020/input/day14input.txt', ['\n', ' = ']);

const lastSetMemory = commands
    .slice()
    .reverse()
    .filter((c, i) => c[0] === 'mask' || commands.findIndex(ci => c[0] === ci[0]) === i)
    .reverse();

const maskSets = groupByMask(lastSetMemory);

const memSets = maskSets.flatMap(ms => ms.lines.map(l => applyMask(ms.mask, l.value)));

console.log(sum(memSets)); // 7817357407588

const maskMemory = groupByMask(commands)
    .reduce((mem: MaskMemory, ms) =>
        ms.lines.reduce((mm: MaskMemory, line) =>
            mm.insert(applyMemoryMask(ms.mask, line.mem), line.value),
            mem),
        MaskMemory.EMPTY);

console.log(maskMemory.sumContents()); // 4335927555692
