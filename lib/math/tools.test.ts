import { isBetween } from './tools';

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
