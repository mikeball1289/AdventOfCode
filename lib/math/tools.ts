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

export function gcd(a: number, b: number): number {
    if (b === 0) return a;
    return Math.abs(gcd(b, a % b));
}

export function gcdExtended(a: number, b: number): { r: number, x: number, y: number } {
    if (a === 0) {
        return { r: b, x: 0, y: 1 };
    }

    const d = gcdExtended(b % a, a);
    return {
        r: d.r,
        x: d.y - Math.floor(b / a) * d.x,
        y: d.x,
    };
}

export function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b);
}

export function modInverse(a: number, m: number) {
    const d = gcdExtended(a, m);
    if (d.r !== 1) {
        return NaN;
    }

    return (d.x % m + m) % m;
}

export function modDivide(a: number, b: number, m: number) {
    const aP = (a % m + m) % m;
    const inv = modInverse(b, m);
    return (inv * aP) % m;
}
