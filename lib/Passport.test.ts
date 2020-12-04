import { fieldValidators, Passport, PassportFieldLabel, validFieldLabels } from './Passport';

describe('Passport', () => {
    describe('constructor', () => {
        it('should fail to construct with duplicate parts', () => {
            const testFn = () => new Passport([{
                label: PassportFieldLabel.BIRTH_YEAR,
                value: '2000',
            }, {
                label: PassportFieldLabel.COUNTRY_ID,
                value: '1',
            }, {
                label: PassportFieldLabel.BIRTH_YEAR,
                value: '2000',
            }]);

            expect(testFn).toThrowError();
        });

        it('should construct with a set of valid fields', () => {
            const passport = new Passport([{
                label: PassportFieldLabel.BIRTH_YEAR,
                value: '2000',
            }, {
                label: PassportFieldLabel.COUNTRY_ID,
                value: '1',
            }, {
                label: PassportFieldLabel.EYE_COLOR,
                value: 'blu',
            }]);

            expect(passport).toBeDefined();
        });

        it('should construct with no fields', () => {
            const passport = new Passport([]);

            expect(passport).toBeDefined();
        });
    });

    describe('fromText', () => {
        it('should throw an error when reading invalid text', () => {
            const testFn = () => Passport.fromText('asdasdasd');

            expect(testFn).toThrowError();
        });

        it('should throw an error when reading text with an invalid field', () => {
            const testFn = () => Passport.fromText('ecl:gry asd:asd');

            expect(testFn).toThrowError();
        });

        it('should construct from valid passport text representations', () => {
            const text = 'ecl:gry pid:860033327 eyr:2020 hcl:#fffffd\n' +
                'byr:1937 iyr:2017 cid:147 hgt:183cm';
            const passport = Passport.fromText(text);

            expect(passport).toBeDefined();
        });
    });

    describe('validate', () => {
        it('should return true when all of the required fields are present', () => {
            const passport = new Passport([{
                label: PassportFieldLabel.BIRTH_YEAR,
                value: '2000',
            }, {
                label: PassportFieldLabel.COUNTRY_ID,
                value: '1',
            }, {
                label: PassportFieldLabel.EYE_COLOR,
                value: 'blu',
            }]);

            const result = passport.validate([PassportFieldLabel.BIRTH_YEAR, PassportFieldLabel.COUNTRY_ID]);

            expect(result).toBe(true);
        });

        it('should return false when a required field is missing', () => {
            const passport = new Passport([{
                label: PassportFieldLabel.BIRTH_YEAR,
                value: '2000',
            }, {
                label: PassportFieldLabel.COUNTRY_ID,
                value: '1',
            }, {
                label: PassportFieldLabel.EYE_COLOR,
                value: 'blu',
            }]);

            const result = passport.validate([PassportFieldLabel.BIRTH_YEAR, PassportFieldLabel.HAIR_COLOR]);

            expect(result).toBe(false);
        });

        it('should return true when no fields are required', () => {
            const passport = new Passport([{
                label: PassportFieldLabel.BIRTH_YEAR,
                value: '2000',
            }, {
                label: PassportFieldLabel.COUNTRY_ID,
                value: '1',
            }, {
                label: PassportFieldLabel.EYE_COLOR,
                value: 'blu',
            }]);

            const result = passport.validate([]);

            expect(result).toBe(true);
        });

        it('should pass the given test cases', () => {
            const testCaseInput =
                'ecl:gry pid:860033327 eyr:2020 hcl:#fffffd\n' +
                'byr:1937 iyr:2017 cid:147 hgt:183cm\n' +
                '\n' +
                'iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884\n' +
                'hcl:#cfa07d byr:1929\n' +
                '\n' +
                'hcl:#ae17e1 iyr:2013\n' +
                'eyr:2024\n' +
                'ecl:brn pid:760753108 byr:1931\n' +
                'hgt:179cm\n' +
                '\n' +
                'hcl:#cfa07d eyr:2025 pid:166559648\n' +
                'iyr:2011 ecl:brn hgt:59in\n';

            const testPassports = testCaseInput.split('\n\n').map(line => Passport.fromText(line));
            // we expect to see all fields except country id
            const requiredFields = validFieldLabels.filter(l => l !== PassportFieldLabel.COUNTRY_ID);

            const results = testPassports.map(passport => passport.validate(requiredFields, false));

            expect(results).toStrictEqual([true, false, true, false]);
        });

        it('should correctly find invalid fields in passports', () => {
            const testCaseInput =
                'eyr:1972 cid:100\n' +
                'hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926\n' +
                '\n' +
                'iyr:2019\n' +
                'hcl:#602927 eyr:1967 hgt:170cm\n' +
                'ecl:grn pid:012533040 byr:1946\n' +
                '\n' +
                'hcl:dab227 iyr:2012\n' +
                'ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277\n' +
                '\n' +
                'hgt:59cm ecl:zzz\n' +
                'eyr:2038 hcl:74454a iyr:2023\n' +
                'pid:3556412378 byr:2007\n';

            const testPassports = testCaseInput.split('\n\n').map(line => Passport.fromText(line));
            // we expect to see all fields except country id
            const requiredFields = validFieldLabels.filter(l => l !== PassportFieldLabel.COUNTRY_ID);

            const results = testPassports.map(passport => passport.validate(requiredFields));

            expect(results).toStrictEqual([false, false, false, false]);
        });

        it('should correctly identify passports with all valid fields', () => {
            const testCaseInput =
                'pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980\n' +
                'hcl:#623a2f\n' +
                '\n' +
                'eyr:2029 ecl:blu cid:129 byr:1989\n' +
                'iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm\n' +
                '\n' +
                'hcl:#888785\n' +
                'hgt:164cm byr:2001 iyr:2015 cid:88\n' +
                'pid:545766238 ecl:hzl\n' +
                'eyr:2022\n' +
                '\n' +
                'iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719\n';

            const testPassports = testCaseInput.split('\n\n').map(line => Passport.fromText(line));
            // we expect to see all fields except country id
            const requiredFields = validFieldLabels.filter(l => l !== PassportFieldLabel.COUNTRY_ID);

            const results = testPassports.map(passport => passport.validate(requiredFields));

            expect(results).toStrictEqual([true, true, true, true]);
        });
    });
});

describe('fieldValidators', () => {
    describe('birth year', () => {
        it('should pass valid input', () => {
            expect(fieldValidators.byr('2002')).toBe(true);
        });

        it('should fail invalid input', () => {
            expect(fieldValidators.byr('2003')).toBe(false);
        });
    });

    describe('height', () => {
        it('should pass valid input', () => {
            expect(fieldValidators.hgt('60in')).toBe(true);
            expect(fieldValidators.hgt('190cm')).toBe(true);
        });

        it('should fail invalid input', () => {
            expect(fieldValidators.hgt('190in')).toBe(false);
            expect(fieldValidators.hgt('190')).toBe(false);
        });
    });

    describe('hair color', () => {
        it('should pass valid input', () => {
            expect(fieldValidators.hcl('#123abc')).toBe(true);
        });

        it('should fail invalid input', () => {
            expect(fieldValidators.hcl('#123abz')).toBe(false);
            expect(fieldValidators.hcl('123abc')).toBe(false);
        });
    });

    describe('eye color', () => {
        it('should pass valid input', () => {
            expect(fieldValidators.ecl('brn')).toBe(true);
        });

        it('should fail invalid input', () => {
            expect(fieldValidators.ecl('wat')).toBe(false);
        });
    });

    describe('password id', () => {
        it('should pass valid input', () => {
            expect(fieldValidators.pid('000000001')).toBe(true);
        });

        it('should fail invalid input', () => {
            expect(fieldValidators.pid('0123456789')).toBe(false);
        });
    });
});
