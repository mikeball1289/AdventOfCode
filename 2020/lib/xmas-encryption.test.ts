import { findContinuousSubsetSum } from './xmas-encryption';

describe('findContinuousSubsetSum', () => {
    it('should find all continuous subsets of any size which sum to the given target', () => {
        const data = [1, 2, 3, 4, 2, 4, 3, 2, 1, 10, 12, 13, 14];
        const result = findContinuousSubsetSum(data, 6);
        expect(result).toStrictEqual([[1, 2, 3], [4, 2], [2, 4], [3, 2, 1]]);
    });

    it('should return an empty list if no subsets sum to the target', () => {
        const data = [1, 2, 3, 4, 5, 6];
        const result = findContinuousSubsetSum(data, 100);

        expect(result).toStrictEqual([]);
    });
});
