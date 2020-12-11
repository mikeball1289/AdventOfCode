import { Map2d } from './Map2d';

describe('Map2d', () => {
    describe('constructor', () => {
        it('should reject an empty data array', () => {
            expect(() => new Map2d([])).toThrowError();
        });

        it('should construct with one column and no cells', () => {
            const result = new Map2d([[]]);

            expect(result).toBeDefined();
        });

        it('should reject non-rectangular arrays', () => {
            const matrix = [
                [1, 2, 3],
                [1, 2],
                [1, 2, 3],
            ];

            expect(() => new Map2d(matrix)).toThrowError();
        });

        it('should accept a matrix of data', () => {
            const matrix = [
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
            ];

            const result = new Map2d(matrix);

            expect(result).toBeDefined();
        });
    });

    describe('width', () => {
        it('should return the size of the first dimension in the given matrix', () => {
            const matrix = [
                [1, 2],
                [1, 2],
                [1, 2],
            ];

            const result = new Map2d(matrix);

            expect(result.width).toBe(2);
        });
    });

    describe('height', () => {
        it('should return the size of the second dimension in the given matrix', () => {
            const matrix = [
                [1, 2],
                [1, 2],
                [1, 2],
            ];

            const result = new Map2d(matrix);

            expect(result.height).toBe(3);
        });
    });

    describe('get', () => {
        it('should return the value at the given coordinates', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ];

            const map = new Map2d(matrix);

            expect(map.get(0, 1)).toBe(3);
            expect(map.get(1, 0)).toBe(2);
        });

        it('should throw an error when trying to access data outside the bounds of the matrix', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ];

            const map = new Map2d(matrix);

            expect(() => map.get(0, 2)).toThrowError();
            expect(() => map.get(4, 1)).toThrowError();
            expect(() => map.get(-2, 1)).toThrowError();
            expect(() => map.get(0, -5)).toThrowError();
        });
    });

    describe('set', () => {
        it('should create a new map with the value set at the given coordinates', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ];

            const map = new Map2d(matrix);

            expect(map.set(0, 1, 5).toString()).toBe('12\n54');
            expect(map.set(1, 0, 5).toString()).toBe('15\n34');
        });

        it('should throw an error when trying to set data outside the bounds of the matrix', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ];

            const map = new Map2d(matrix);

            expect(() => map.set(0, 2, 5)).toThrowError();
            expect(() => map.set(4, 1, 5)).toThrowError();
            expect(() => map.set(-2, 1, 5)).toThrowError();
            expect(() => map.set(0, -5, 5)).toThrowError();
        });
    });

    describe('map', () => {
        it('should return a new map with the given transformation applied', () => {
            const matrix = [
                [1, 2],
                [3, 4],
            ];

            const result = new Map2d(matrix).map((el) => el * 2);

            expect(result.toString()).toBe('24\n68');
        });

        it('should pass the coords and full map as additional parameters to the mapping function', () => {
            const matrix = [[1, 2]];

            const result = new Map2d(matrix).map((_, x, y, map) => `${x}${y}${map.toString()}`);

            expect(result.toString()).toBe('00121012');
        });
    });

    describe('toString', () => {
        it('should generate a string representation of the map', () => {
            const matrix = [
                ['a', 'b'],
                ['c', 'd'],
            ];

            const result = new Map2d(matrix).toString();

            expect(result).toBe('ab\ncd');
        });
    });

    describe('values', () => {
        it('should return a 1d array of all the values in the map', () => {
            const matrix = [
                ['a', 'b'],
                ['c', 'd'],
            ];

            const result = new Map2d(matrix).values();

            expect(result).toStrictEqual(['a', 'b', 'c', 'd']);
        });
    });
});
