import { openAoC } from '../../lib/input/openAoC';
import { parseLine, passwordSatisfiesRequirement, passwordSatisfiesTobogganRequirement } from '../../lib/passwords';

const lines = openAoC('./input/day2input.txt', ['\n']);

const passwordLines = lines.map(parseLine);
const validPasswords = passwordLines.filter(pl => passwordSatisfiesRequirement(pl.password, pl.requirement));

console.log(validPasswords.length); // 378

const validTobogganPasswords = passwordLines.filter(pl => passwordSatisfiesTobogganRequirement(pl.password, pl.requirement));

console.log(validTobogganPasswords.length); // 280
