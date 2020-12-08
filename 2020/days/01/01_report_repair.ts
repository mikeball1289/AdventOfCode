import { openAoC } from '../../../lib/input/openAoC';
import { choose } from '../../../lib/math/settools';

const input = openAoC('./2020/input/day1input.txt', ['\n']);
const numbers = input.map(n => parseInt(n, 10));

const relevantPairs = choose(numbers, 2).filter(([a, b]) => a + b === 2020);
console.log(relevantPairs.map(([a, b]) => a * b)); // [1016619]

const relevantTriples = choose(numbers, 3).filter(([a, b, c]) => a + b + c === 2020);
console.log(relevantTriples.map(([a, b, c]) => a * b * c)); // [218767230]
