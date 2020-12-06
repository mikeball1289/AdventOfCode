import { readFileSync } from 'fs';
import { parseLine, passwordSatisfiesRequirement, passwordSatisfiesTobogganRequirement } from '../../lib/passwords';

const input = readFileSync('./input/day2input.txt', 'ascii').replace(/\r\n/g, '\n');
const lines = input.split('\n').filter(s => s !== ''); // trim blank lines

const passwordLines = lines.map(parseLine);
const validPasswords = passwordLines.filter(pl => passwordSatisfiesRequirement(pl.password, pl.requirement));

console.log(validPasswords.length); // 378

const validTobogganPasswords = passwordLines.filter(pl => passwordSatisfiesTobogganRequirement(pl.password, pl.requirement));

console.log(validTobogganPasswords.length); // 280
