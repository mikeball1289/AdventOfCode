import { openAoC } from '../../lib/input/openAoC';
import { parseLine, passwordSatisfiesRequirement, passwordSatisfiesTobogganRequirement } from '../../lib/passwords';

describe('Day 2 - Password Philosophy', () => {
    test('Part 1 solves', () => {
        const lines = openAoC('./input/day2input.txt', ['\n']);

        const passwordLines = lines.map(parseLine);
        const validPasswords = passwordLines.filter(pl => passwordSatisfiesRequirement(pl.password, pl.requirement));

        expect(validPasswords.length).toBe(378);
    });

    test('Part 2 solves', () => {
        const lines = openAoC('./input/day2input.txt', ['\n']);

        const passwordLines = lines.map(parseLine);
        const validPasswords = passwordLines.filter(pl => passwordSatisfiesTobogganRequirement(pl.password, pl.requirement));

        expect(validPasswords.length).toBe(280);
    });
});
