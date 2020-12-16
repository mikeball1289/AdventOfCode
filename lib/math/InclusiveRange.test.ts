import { InclusiveRange } from './InclusiveRange';

describe('InclusiveRange', () => {
    describe('constructor', () => {
        it('should build a range with the given parameters', () => {
            expect(new InclusiveRange(1, 5)).toBeDefined();
            expect(new InclusiveRange(3, 3)).toBeDefined();
        });

        it('should throw if the min of the range is less than the max', () => {
            expect(() => new InclusiveRange(5, 2)).toThrowError();
        });
    });

    describe('contains', () => {
        it('should be true if the given number is within the range (inclusive)', () => {
            expect(new InclusiveRange(1, 7).contains(5)).toBe(true);
            expect(new InclusiveRange(1, 7).contains(1)).toBe(true);
            expect(new InclusiveRange(1, 7).contains(7)).toBe(true);
            expect(new InclusiveRange(4, 4).contains(4)).toBe(true);
        });

        it('should be false if the given number is not within the range (inclusive)', () => {
            expect(new InclusiveRange(3, 5).contains(-2)).toBe(false);
            expect(new InclusiveRange(3, 5).contains(7)).toBe(false);
        });
    });

    describe('overlaps', () => {
        it('should be true if the ranges overlap at all', () => {
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(-2, 1))).toBe(true);
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(5, 5))).toBe(true);
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(2, 3))).toBe(true);
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(-2, 10))).toBe(true);
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(1, 1))).toBe(true);
        });

        it('should be false if the ranges are distinct', () => {
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(-2, 0))).toBe(false);
            expect(new InclusiveRange(1, 5).overlaps(new InclusiveRange(7, 10))).toBe(false);
        });
    });

    describe('combine', () => {
        it('should return a range which covers both given ranges', () => {
            expect(new InclusiveRange(1, 5).combine(new InclusiveRange(-2, 1))).toMatchObject({ min: -2, max: 5 });
            expect(new InclusiveRange(1, 5).combine(new InclusiveRange(5, 5))).toMatchObject({ min: 1, max: 5 });
            expect(new InclusiveRange(1, 5).combine(new InclusiveRange(2, 3))).toMatchObject({ min: 1, max: 5 });
        });

        it('should throw if the ranges don\'t overlap', () => {
            expect(() => new InclusiveRange(1, 5).combine(new InclusiveRange(-2, 0))).toThrowError();
            expect(() => new InclusiveRange(1, 5).combine(new InclusiveRange(7, 10))).toThrowError();
        });
    });
});
