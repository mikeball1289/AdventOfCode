import { readFileSync } from 'fs';
import { choose } from '../lib/settools';

const input = readFileSync('./input/day1input.txt', 'ascii');
const numbers = input.split('\n').map(n => parseInt(n));

const relevantPairs = choose(numbers, 3).filter(([a, b, c]) => a + b + c === 2020);
console.log(relevantPairs.map(([a, b, c]) => a * b * c)); // [218767230]
