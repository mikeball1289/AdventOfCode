import { ints, openAoC } from '../../../lib/input/openAoC';
import { choose, sum } from '../../../lib/math/settools';
import { findContinuousSubsetSum } from '../../lib/xmas-encryption';

const data = openAoC('./2020/input/day9input.txt', ['\n'], ints);

const errors = data.filter((n, i) =>
    !(i < 25 || choose(data.slice(i - 25, i), 2).map(sum).includes(n))
);

console.log(errors); // [21806024]

const results = findContinuousSubsetSum(data, 21806024).filter(s => s.length > 1);
console.log(results.map(r => Math.min(...r) + Math.max(...r))); // [2986195]
