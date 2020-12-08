import { parseBoardingPass } from './boarding-passes';

describe('parseBoardingPass', () => {
    it('should throw an error if too short', () => {
        expect(() => parseBoardingPass('FBF')).toThrowError();
    });

    it('should throw an error if too long', () => {
        expect(() => parseBoardingPass('FFBBFFBLRLRL')).toThrowError();
    });

    it('should have NaN parts if invalid characters are present', () => {
        const result = parseBoardingPass('ABCABCADEF');

        expect(result.row).toBeNaN();
        expect(result.col).toBeNaN();
        expect(result.seat).toBeNaN();
    });

    it('should pass the given test cases', () => {
        const testCases = [
            'BFFFBBFRRR',
            'FFFBBBFRRR',
            'BBFFBBFRLL',
        ];

        const expectedResults = [
            { row: 70, col: 7, seat: 567 },
            { row: 14, col: 7, seat: 119 },
            { row: 102, col: 4, seat: 820 },
        ];

        const results = testCases.map(testCase => parseBoardingPass(testCase));

        expect(results).toStrictEqual(expectedResults);
    });
});
