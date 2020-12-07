import { readFileSync } from 'fs';
import { BagRuleSet } from '../../lib/BagRuleSet';

describe('Day 7 - Handy Haversacks', () => {
    test('Part 1 solves', () => {
        const input = readFileSync('./input/day7input.txt', 'ascii').replace(/\r\n/g, '\n');
        const ruleSet = BagRuleSet.fromText(input);
        const canContainShinyGold = ruleSet.ancestorsOf('shiny gold');

        expect(canContainShinyGold.length).toBe(192);
    });

    test('Part 2 solves', () => {
        const input = readFileSync('./input/day7input.txt', 'ascii').replace(/\r\n/g, '\n');
        const ruleSet = BagRuleSet.fromText(input);
        const totalBagsForShinyGold = ruleSet.totalBagsForColor('shiny gold');

        // subtract one because the puzzle doesn't count the outermost bag
        expect(totalBagsForShinyGold - 1).toBe(12128);
    });
});
