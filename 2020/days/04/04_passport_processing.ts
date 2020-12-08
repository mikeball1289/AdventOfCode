import { openAoC } from '../../../lib/input/openAoC';
import { Passport, PassportFieldLabel, validFieldLabels } from '../../lib/Passport';

const input = openAoC('./2020/input/day4input.txt', ['\n\n']);

const passports = input.map(line => Passport.fromText(line));
// we expect to see all fields except country id
const requiredFields = validFieldLabels.filter(f => f !== PassportFieldLabel.COUNTRY_ID);

const validPassports = passports.filter(passport => passport.validate(requiredFields, false));

console.log(validPassports.length); // 256

const validPassportsWithValidFields = passports.filter(passport => passport.validate(requiredFields));

console.log(validPassportsWithValidFields.length); // 198
