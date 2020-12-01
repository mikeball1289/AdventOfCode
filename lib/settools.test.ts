import { choose } from './settools';

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