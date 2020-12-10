import { ints, openAoC } from '../../../lib/input/openAoC';
import { ascending, firstDifferences } from '../../../lib/math/settools';
import { countAlternativeSequences } from '../../lib/adapters';

const adapters = openAoC('./2020/input/day10input.txt', ['\n'], ints);

const adapterChain = adapters.sort(ascending);
// add in the wall and device joltage levels
const sequence = [0, ...adapterChain, adapterChain.slice(-1)[0] + 3];
const firstDiffs = firstDifferences(sequence);
const joltGap1 = firstDiffs.filter(n => n === 1).length;
const joltGap3 = firstDiffs.filter(n => n === 3).length;

console.log(joltGap1 * joltGap3); // 1885

const count = countAlternativeSequences(sequence);

console.log(count); // 2024782584832
