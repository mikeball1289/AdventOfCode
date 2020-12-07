import { readFileSync } from 'fs';
import { BagRuleSet } from '../../lib/BagRuleSet';

const input = readFileSync('./input/day7input.txt', 'ascii').replace(/\r\n/g, '\n');
const ruleSet = BagRuleSet.fromText(input);
const canContainShinyGold = ruleSet.ancestorsOf('shiny gold');

console.log(canContainShinyGold.length); // 192

const totalBagsForShinyGold = ruleSet.totalBagsForColor('shiny gold');

// subtract one because the puzzle doesn't count the outermost bag
console.log(totalBagsForShinyGold - 1); // 12128
