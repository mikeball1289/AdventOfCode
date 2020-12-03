import { choose, range } from './settools';

describe('choose function', () => {
    it('should return an empty array when trying to select more elements than there are in the set', () => {
        const result = choose([1, 2, 3], 4);
        
        expect(result).toStrictEqual([]);
    });

    it('should return all subsets of the given size from a set', () => {
        const result = choose([1, 2, 3], 2);

        expect(result).toStrictEqual([[1, 2], [1, 3], [2, 3]]);
    });

    it('should return a single element (the given array) when choosing n where n is the size of the given set', () => {
        const result = choose([1, 2, 3], 3);

        expect(result).toStrictEqual([[1, 2, 3]]);
    });

    it('should return a set of size M choose N when choosing N elements from a set of size M', () => {
        function fact(n: number): number {
            if (n < 1) return 1;
            return n * fact(n - 1);
        }

        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        const result = choose(arr, 4);
        const expectedSize = fact(arr.length) / (fact(4) * fact(arr.length - 4));

        expect(result.length).toBe(expectedSize);
    });

    it('should permute properly even with duplicates in the list', () => {
        const result = choose([1, 1, 1], 2);

        expect(result).toStrictEqual([[1, 1], [1, 1], [1, 1]]);
    });

    it('should return an empty array when trying to select subsets with 0 or negative size', () => {
        expect(choose([1, 2, 3], 0)).toStrictEqual([]);
        expect(choose([1, 2, 3], -2)).toStrictEqual([]);
    });

    it('should round up when selecting subsets with non-integer size', () => {
        const result = choose([1, 2, 3], 1.5);

        expect(result).toStrictEqual([[1, 2], [1, 3], [2, 3]]);
    });
});

describe('range', () => {
    it('should count from start (inclusive) to end (exclusive)', () => {
        const result = range(5, 10);

        expect(result).toStrictEqual([5, 6, 7, 8, 9]);
    });

    it('should return an empty range when start and end are the same', () => {
        const result = range(3, 3);

        expect(result).toStrictEqual([]);
    });

    it('should be able to count by non-1 increments', () => {
        const result = range(1, 12, 3);

        expect(result).toStrictEqual([1, 4, 7, 10]);
    });

    it('should be able to count by non-integer increments', () => {
        const result = range(1, 5, 0.6);

        expect(result).toStrictEqual([1, 1.6, 2.2, 2.8, 3.4, 4.0, 4.6]);
    });

    it('should be able to count backwards', () => {
        const result = range(0, -10, -2);

        expect(result).toStrictEqual([0, -2, -4, -6, -8]);
    });

    it('should throw an error when counting by 0s', () => {
        const testFn = () => range(0, 10, 0);

        expect(testFn).toThrowError();
    });

    it('should throw an error when end is not reachable from start', () => {
        const testFn = () => range(10, 5);

        expect(testFn).toThrowError();
    });
});