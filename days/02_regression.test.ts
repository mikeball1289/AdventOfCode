import { readFileSync } from 'fs';
import { parseLine, passwordSatisfiesRequirement, passwordSatisfiesTobogganRequirement } from '../lib/passwords';

describe('Day 2 - Password Philosophy', () => {
    test('Part 1 solves', () => {
        const input = readFileSync('./input/day2input.txt', 'ascii');
        const lines = input.split('\n').filter(s => s !== ''); // trim blank lines

        const passwordLines = lines.map(parseLine);
        const validPasswords = passwordLines.filter(pl => passwordSatisfiesRequirement(pl.password, pl.requirement));

        expect(validPasswords.length).toBe(378);
    });

    test('Part 2 solves', () => {
        const input = readFileSync('./input/day2input.txt', 'ascii');
        const lines = input.split('\n').filter(s => s !== ''); // trim blank lines

        const passwordLines = lines.map(parseLine);
        const validPasswords = passwordLines.filter(pl => passwordSatisfiesTobogganRequirement(pl.password, pl.requirement));

        expect(validPasswords.length).toBe(280);
    });
});