import { readFileSync } from 'fs';
import { Passport, PassportFieldLabel, validFieldLabels } from '../../lib/Passport';

const input = readFileSync('./input/day4input.txt', 'ascii').replace(/\r\n/g, '\n');

const passports = input.split('\n\n').map(line => Passport.fromText(line));
// we expect to see all fields except country id
const requiredFields = validFieldLabels.filter(f => f !== PassportFieldLabel.COUNTRY_ID);

const validPassports = passports.filter(passport => passport.validate(requiredFields, false));

console.log(validPassports.length); // 256

const validPassportsWithValidFields = passports.filter(passport => passport.validate(requiredFields));

console.log(validPassportsWithValidFields.length); // 198
