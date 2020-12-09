/**
 * Check if a number is within the given range (inclusive)
 */
export function isBetween(n: number, range: [number, number]) {
    return n <= Math.max(...range) && n >= Math.min(...range);
}
