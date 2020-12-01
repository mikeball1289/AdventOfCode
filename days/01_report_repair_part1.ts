import { readFileSync } from 'fs';
import { choose } from '../lib/settools';

const input = readFileSync('./input/day1input.txt', 'ascii');
const numbers = input.split('\n').map(n => parseInt(n));

const relevantPairs = choose(numbers, 2).filter(([a, b]) => a + b === 2020);
console.log(relevantPairs.map(([a, b]) => a * b)); // [1016619]
