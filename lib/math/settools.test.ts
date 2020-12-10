import { ascending, blocks, choose, cross, descending, eq, firstDifferences, intersect, prod, range, reduction, sum, uniq, zip } from './settools';

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

describe('uniq', () => {
    it('should remove duplicate elements from the given list', () => {
        const result = uniq([1, 1, 2, 2, 3, 1]);

        expect(result).toStrictEqual([1, 2, 3]);
    });

    it('should do nothing if the list contains no duplicates', () => {
        const testCases = [[1, 2, 3], []];

        const results = testCases.map(uniq);

        expect(results).toStrictEqual(testCases);
    });

    it('should compare objects in the list by reference', () => {
        const testObj = { a: 1, b: 'foo' };
        const result = uniq([testObj, { a: 1, b: 'foo' }, testObj]);

        expect(result).toStrictEqual([{ a: 1, b: 'foo' }, { a: 1, b: 'foo' }]);
    });

    it('should pass the simple example case', () => {
        const example =
            'abcx\n' +
            'abcy\n' +
            'abcz\n';

        const answers = example.split('\n').join('').split('');
        const uniqueAnswers = uniq(answers);

        expect(uniqueAnswers.length).toBe(6);
    });

    it('should pass the given test cases', () => {
        const testCases =
            'abc\n' +
            '\n' +
            'a\n' +
            'b\n' +
            'c\n' +
            '\n' +
            'ab\n' +
            'ac\n' +
            '\n' +
            'a\n' +
            'a\n' +
            'a\n' +
            'a\n' +
            '\n' +
            'b\n';

        const results = testCases
            .split('\n\n')
            .map(test => test.split('\n').join('').split(''))
            .map(uniq);

        expect(results.map(r => r.length)).toStrictEqual([3, 3, 3, 1, 1]);
    });
});

describe('intersect', () => {
    it('should return an empty set if either input is empty', () => {
        expect(intersect([], [1, 2, 3])).toStrictEqual([]);
    });

    it('should return the list of common elements between two sets', () => {
        const testCases: [number[], number[]][] = [
            [[1, 2, 3], [1, 2]],
            [[4, 5, 6], [4, 5, 6]],
            [[5], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
        ];

        const expectedResults = [
            [1, 2],
            [4, 5, 6],
            [5]
        ];

        const results = testCases.map(([a, b]) => intersect(a, b));
        expect(results).toStrictEqual(expectedResults);
    });

    it('should return the empty set if there are no common elements', () => {
        expect(intersect([1, 2, 3], [4, 5, 6])).toStrictEqual([]);
    });

    it('should not consider duplicates when finding the intersection', () => {
        const result = intersect([1, 1, 1, 2, 2, 3], [1, 1, 2]);

        expect(result).toStrictEqual([1, 2]);
    });

    it('should pass the given test cases', () => {
        const testCases =
            'abc\n' +
            '\n' +
            'a\n' +
            'b\n' +
            'c\n' +
            '\n' +
            'ab\n' +
            'ac\n' +
            '\n' +
            'a\n' +
            'a\n' +
            'a\n' +
            'a\n' +
            '\n' +
            'b\n';

        const testSets = testCases
            .split('\n\n')
            .map(testCase => testCase
                .split('\n')
                .filter(l => l !== '')
                .map(l => l.split(''))
            );

        const results = testSets.map(s => reduction(s, intersect));

        expect(results.map(r => r.length)).toStrictEqual([3, 0, 1, 1, 1]);
    });
});

describe('reduction', () => {
    const add = (a: number, b: number) => a + b;

    it('should throw an error when given the empty set', () => {
        const testFn = () => reduction([], add);

        expect(testFn).toThrowError();
    });

    it('should compute the reduction of the given set', () => {
        const result = reduction([1, 2, 3], add);

        expect(result).toBe(6);
    });

    it('should return the only element without calling the reducer when given a single-element set', () => {
        const result = reduction([3], (a, b) => 0);

        expect(result).toBe(3);
    });
});

describe('sum', () => {
    it('should compute the sum of a list of numbers', () => {
        const result = sum([1, 2, 3]);

        expect(result).toBe(6);
    });

    it('should return 0 when the list is empty', () => {
        expect(sum([])).toBe(0);
    });
});

describe('prod', () => {
    it('should return the product of a list of numbers', () => {
        const result = prod([1, 2, 3, 4]);

        expect(result).toBe(24);
    });

    it('should return 1 when the list is empty', () => {
        expect(prod([])).toBe(1);
    });
});

describe('eq', () => {
    it('should return true if all elements in the list are the same', () => {
        expect(eq([1, 1, 1])).toBe(true);
    });

    it('should return true if the list is empty or contains only one element', () => {
        expect(eq([])).toBe(true);
        expect(eq([1])).toBe(true);
    });

    it('should return false if any of the elements in the list are unique', () => {
        expect(eq([1, 1, 2])).toBe(false);
        expect(eq([1, 2, 3])).toBe(false);
        expect(eq([1, 2, 1, 2])).toBe(false);
    });
});

describe('cross', () => {
    it('should pair each element in the first list with each element in the second list', () => {
        const list1 = [1, 2, 3];
        const list2 = ['a', 'b'];

        expect(cross(list1, list2)).toStrictEqual([[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b'], [3, 'a'], [3, 'b']]);
    });

    it('should be empty if either input list is empty', () => {
        expect(cross([1, 2, 3], [])).toStrictEqual([]);
        expect(cross([], [1, 2, 3])).toStrictEqual([]);
    });
});

describe('zip', () => {
    it('should pair the elements of two lists one-to-one', () => {
        const result = zip([1, 2, 3], [4, 5, 6]);

        expect(result).toStrictEqual([[1, 4], [2, 5], [3, 6]]);
    });

    it('should truncate the longer list to the length of the shorter one', () => {
        expect(zip([1, 2, 3], [4, 5, 6, 7, 8])).toStrictEqual([[1, 4], [2, 5], [3, 6]]);
        expect(zip([1, 2, 3, 4, 5], [6, 7, 8])).toStrictEqual([[1, 6], [2, 7], [3, 8]]);
    });
});

describe('blocks', () => {
    it('should split an array into blocks of continuous identical elements', () => {
        const result = blocks('aabbbaa'.split(''));

        expect(result).toStrictEqual([{ el: 'a', len: 2 }, { el: 'b', len: 3 }, { el: 'a', len: 2 }]);
    });
});

describe('ascending', () => {
    it('should sort an array of numbers in ascending order', () => {
        expect([4, 5, 2, -1, 7].sort(ascending)).toStrictEqual([-1, 2, 4, 5, 7]);
    });
});

describe('descending', () => {
    it('should sort an array of numbers in a descending order', () => {
        expect([4, 5, 2, -1, 7].sort(descending)).toStrictEqual([7, 5, 4, 2, -1]);
    });
});

describe('firstDifferences', () => {
    it('should return the difference between each pair of consecutive elements in the given array', () => {
        expect(firstDifferences([1, -2, -1, 3, 5])).toStrictEqual([-3, 1, 4, 2]);
    });

    it('should return an empty array if the given set is empty or has only one element', () => {
        expect(firstDifferences([])).toStrictEqual([]);
        expect(firstDifferences([1])).toStrictEqual([]);
    });
});
