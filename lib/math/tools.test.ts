import { digits, gcd, gcdExtended, isBetween, lcm, modDivide, modInverse } from './tools';

describe('isBetween', () => {
    it('should return true if the given number is within the range', () => {
        const result = isBetween(5, [1, 10]);

        expect(result).toBe(true);
    });

    it('should return false if the given number isn\'t in the range', () => {
        const result = isBetween(-3, [1, 10]);

        expect(result).toBe(false);
    });

    it('should return true if the given number is on the edge of the range', () => {
        expect(isBetween(5, [5, 5])).toBe(true);
        expect(isBetween(2, [2, 5])).toBe(true);
        expect(isBetween(10, [5, 10])).toBe(true);
    });

    it('should not matter what order the range numbers are given in', () => {
        expect(isBetween(5, [7, 2])).toBe(true);
        expect(isBetween(5, [-4, -10])).toBe(false);
    });
});

describe('digits', () => {
    it('should split a number into its base 10 digits', () => {
        expect(digits(1234)).toStrictEqual([1, 2, 3, 4]);
    });

    it('should truncate decimal points', () => {
        expect(digits(12.34)).toStrictEqual([1, 2]);
    });

    it('should ignore negative signs', () => {
        expect(digits(-1234)).toStrictEqual([1, 2, 3, 4]);
    });

    it('should return an empty array for 0', () => {
        expect(digits(0)).toStrictEqual([]);
    });
});

describe('gcd', () => {
    it('should return the greatest common divisor between two numbers', () => {
        expect(gcd(9, 6)).toBe(3);
        expect(gcd(6, 9)).toBe(3);
        expect(gcd(100, 90)).toBe(10);
        expect(gcd(300, 90)).toBe(30);
        expect(gcd(-10, 8)).toBe(2);
        expect(gcd(8, -10)).toBe(2);
    });

    it('should be 1 if the numbers are relative primes', () => {
        expect(gcd(7, 20)).toBe(1);
        expect(gcd(8, 9)).toBe(1);
        expect(gcd(99, 20)).toBe(1);
    });
});

describe('gcdInverse', () => {
    it('should compute gcd as well as x and y such that ax + by = gcd(a, b)', () => {
        expect(gcdExtended(2, 4)).toStrictEqual({
            r: 2,
            x: 1,
            y: 0,
        });

        expect(gcdExtended(9, 6)).toStrictEqual({
            r: 3,
            x: 1,
            y: -1,
        });
        expect(gcdExtended(6, 9)).toStrictEqual({
            r: 3,
            x: -1,
            y: 1,
        });

        expect(gcdExtended(7, 20)).toStrictEqual({
            r: 1,
            x: 3,
            y: -1,
        });
        expect(gcdExtended(8, 9)).toStrictEqual({
            r: 1,
            x: -1,
            y: 1,
        });
    });
});

describe('lcm', () => {
    it('should return the lowest common multiple of the two numbers', () => {
        expect(lcm(2, 4)).toBe(4);
        expect(lcm(6, 9)).toBe(18);
        expect(lcm(15, 9)).toBe(45);
    });

    it('should be the product of the numbers if they are relatively prime', () => {
        expect(lcm(7, 20)).toBe(7 * 20);
        expect(lcm(8, 9)).toBe(8 * 9);
        expect(lcm(99, 20)).toBe(99 * 20);
    });
});

describe('modInverse', () => {
    it('should compute the multiplicative inverse of a under mod m', () => {
        expect(modInverse(5, 3)).toBe(2);
        expect(modInverse(7, 10)).toBe(3);
        expect(modInverse(11, 12)).toBe(11);
        expect(modInverse(2, 7)).toBe(4);
    });

    it('should be NaN when the inverse doesn\'t exist', () => {
        expect(modInverse(3, 9)).toBeNaN();
        expect(modInverse(16, 12)).toBeNaN();
    });
});

describe('modDivide', () => {
    it('should find an x such that x b mod m = a', () => {
        expect(modDivide(1, 7, 20)).toBe(3);
        expect(modDivide(4, 5, 7)).toBe(5);
    });

    it('should be NaN when the division is not possible', () => {
        expect(modDivide(1, 2, 4)).toBeNaN();
    });
});
