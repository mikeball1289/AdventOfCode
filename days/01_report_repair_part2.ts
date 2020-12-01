import { readFileSync } from 'fs';
import { choose } from '../lib/settools';

const input = readFileSync('./input/day1input.txt', 'ascii');
const numbers = input.split('\n').map(n => parseInt(n));

const relevantTriples = choose(numbers, 3).filter(([a, b, c]) => a + b + c === 2020);
console.log(relevantTriples.map(([a, b, c]) => a * b * c)); // [218767230]
