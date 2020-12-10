import { converge, maybeDo, memoize, sat } from './funcs';

describe('converge', () => {
    it('should throw an error if the function never converges', () => {
        const testFn = () => converge(n => n + 1, 0);

        expect(testFn).toThrowError();
    });

    it('should return immediately if the initial value is a fixed point', () => {
        expect(converge(n => n / 2 + 1, 2)).toBe(2);
    });

    it('should find a fixed point of the function through repeated application', () => {
        expect(converge(n => n / 2 + 1, 5)).toBe(2);
    });

    it('should allow for overriding the comparison function', () => {
        expect(converge(Math.cos, 5, () => true)).toBe(Math.cos(5));
        expect(converge(n => n / 2, 4, (a, b) => a - b < 1)).toBe(0.5);
    });
});

describe('maybeDo', () => {
    const add = (x: number, y: number) => x + y;

    it('should perform the given operations if all the operands are defined', () => {
        const result = maybeDo(add, 1, 2);

        expect(result).toBe(3);
    });

    it('should return undefined if any of the operands are undefined', () => {
        const result = maybeDo(add, undefined, 1);

        expect(result).toBeUndefined();
    });
});

describe('sat', () => {
    it('should generate a function that checks a list of conditions on an input', () => {
        const checker = sat<number>([
            n => n % 2 === 0,
            n => n % 3 === 0,
            () => true
        ]);

        expect(checker(6)).toBe(true);
        expect(checker(5)).toBe(false);
    });
});

describe('memoize', () => {
    const fibs = jest.fn();
    fibs.mockImplementation(n => n <= 1 ? 1 : (fibs(n - 2) + fibs(n - 1)));

    it('should remember function invokations and not fully evaluate the function if it already knows the answer', () => {
        const memFibs = memoize(fibs);

        const slowResult = memFibs(5);
        expect(slowResult).toBe(8);
        expect(fibs.mock.calls.length).toBe(15);

        const fastResult = memFibs(5);
        expect(fastResult).toBe(8);
        expect(fibs.mock.calls.length).toBe(15);

        fibs.mockClear();
    });

    it('should accept a custom hash function and use that for lookups', () => {
        const memFibs = memoize(fibs, () => 'a'); // every call is treated the same

        const slowResult = memFibs(5);
        expect(slowResult).toBe(8);
        expect(fibs.mock.calls.length).toBe(15);

        const fastResult = memFibs(1); // should use the precomputed value for 5
        expect(fastResult).toBe(8);
        expect(fibs.mock.calls.length).toBe(15);
        fibs.mockClear();
    });
});
