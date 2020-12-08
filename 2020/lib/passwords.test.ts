import { parseLine, PasswordLine, PasswordRequirement, passwordSatisfiesRequirement, passwordSatisfiesTobogganRequirement } from './passwords';

describe('parseLine', () => {
    it('should throw an error if the password is missing', () => {
        expect(() => parseLine('1-3 a')).toThrowError();
    });

    it('should throw an error if the requirement is missing', () => {
        expect(() => parseLine('abcabc')).toThrowError();
    });

    it('should throw an error if too many parts are given', () => {
        expect(() => parseLine('1-3 a: abcabc: defdef')).toThrowError();
    });

    it('should throw an error if the requirement is improperly formatted', () => {
        expect(() => parseLine('abcabc: abcabc')).toThrowError();
    });

    it('should parse password text lines', () => {
        const result = parseLine('1-3 a: abcabc');

        const expected: PasswordLine = {
            requirement: { min: 1, max: 3, char: 'a' },
            password: 'abcabc',
        };

        expect(result).toStrictEqual(expected);
    });
});

describe('passwordSatisfiesRequirement', () => {
    const requirement: PasswordRequirement = {
        min: 2,
        max: 4,
        char: 'a',
    };

    it('should fail if the password contains too few of the required character', () => {
        const result = passwordSatisfiesRequirement('abcbc', requirement);

        expect(result).toBe(false);
    });

    it('should fail if the password contains too many of the required character', () => {
        const result = passwordSatisfiesRequirement('aabcaabcaabc', requirement);

        expect(result).toBe(false);
    });

    it('should fail if the required amount is not a number', () => {
        const badRequirement: PasswordRequirement = {
            min: 2,
            max: NaN,
            char: 'z',
        };

        const result = passwordSatisfiesRequirement('aabbcczz', badRequirement);

        expect(result).toBe(false);
    });

    it('should pass if the password meets the requirement', () => {
        const result = passwordSatisfiesRequirement('abcabcabc', requirement);

        expect(result).toBe(true);
    });
});

describe('passwordSatisfiesTobogganRequirement', () => {
    it('should pass when one position contains the required character and the other doesn\'t', () => {
        const line = parseLine('1-3 a: abcde');
        const result = passwordSatisfiesTobogganRequirement(line.password, line.requirement);

        expect(result).toBe(true);
    });

    it('should fail when neither position contains the required character', () => {
        const line = parseLine('1-3 b: cdefg');
        const result = passwordSatisfiesTobogganRequirement(line.password, line.requirement);

        expect(result).toBe(false);
    });

    it ('should fail when both positions contain the required character', () => {
        const line = parseLine('2-9 c: ccccccccc');
        const result = passwordSatisfiesTobogganRequirement(line.password, line.requirement);

        expect(result).toBe(false);
    });
});
