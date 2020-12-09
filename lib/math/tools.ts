import { range as generateRange } from './settools';

/**
 * Check if a number is within the given range (inclusive)
 */
export function isBetween(n: number, range: [number, number]) {
    return n <= Math.max(...range) && n >= Math.min(...range);
}

export function digits(n: number) {
    const target = Math.abs(n);
    const length = Math.floor(Math.log10(target)) + 1;
    if (!isFinite(length) || length < 1) return [];
    return generateRange(length, 0, -1).map(p => Math.floor(target / (10 ** (p - 1))) % 10);
}
