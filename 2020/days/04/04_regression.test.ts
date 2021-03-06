import { openAoC } from '../../../lib/input/openAoC';
import { Passport, PassportFieldLabel, validFieldLabels } from '../../lib/Passport';

describe('Day 4 - Passport Processing', () => {
    test('Part 1 solves', () => {
        const input = openAoC('./2020/input/day4input.txt', ['\n\n']);

        const passports = input.map(line => Passport.fromText(line));
        // we expect to see all fields except country id
        const requiredFields = validFieldLabels.filter(f => f !== PassportFieldLabel.COUNTRY_ID);

        const validPassports = passports.filter(passport => passport.validate(requiredFields, false));

        expect(validPassports.length).toBe(256);
    });

    test('Part 2 solves', () => {
        const input = openAoC('./2020/input/day4input.txt', ['\n\n']);

        const passports = input.map(line => Passport.fromText(line));
        // we expect to see all fields except country id
        const requiredFields = validFieldLabels.filter(f => f !== PassportFieldLabel.COUNTRY_ID);

        const validPassports = passports.filter(passport => passport.validate(requiredFields));

        expect(validPassports.length).toBe(198);
    });
});
