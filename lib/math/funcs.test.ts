import { converge } from './funcs';

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
