import { BagRuleSet } from '../../lib/BagRuleSet';
import { openAoC } from '../../../lib/input/openAoC';

const input = openAoC('./2020/input/day7input.txt');
const ruleSet = BagRuleSet.fromText(input);
const canContainShinyGold = ruleSet.ancestorsOf('shiny gold');

console.log(canContainShinyGold.length); // 192

const totalBagsForShinyGold = ruleSet.totalBagsForColor('shiny gold');

// subtract one because the puzzle doesn't count the outermost bag
console.log(totalBagsForShinyGold - 1); // 12128
