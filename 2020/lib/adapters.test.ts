import { ascending } from '../../lib/math/settools';
import { countAlternativeSequences } from './adapters';

describe('countAlternativeSequences', () => {
    it('should return the number of possible arrangements of adapters, given a maximal sequencing of adapters available', () => {
        const testCases = [
            [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4].sort(ascending),
            [28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24, 23, 49, 45, 19, 38, 39, 11, 1, 32, 25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3].sort(ascending),
        ];

        const expectedResults = [8, 19208];

        const results = testCases.map(tc => countAlternativeSequences([0, ...tc, tc.slice(-1)[0] + 3]));

        expect(results).toStrictEqual(expectedResults);
    });
});
