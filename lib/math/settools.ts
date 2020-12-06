function chooseUtil<T>(subset: T[], more: number, rest: T[]): T[][] {
    if (more <= 0) return [subset];
    return rest.flatMap((el, i) => chooseUtil([...subset, el], more - 1, rest.slice(i + 1)));
}

export function choose<T>(set: T[], n: 1): [T][];
export function choose<T>(set: T[], n: 2): [T, T][];
export function choose<T>(set: T[], n: 3): [T, T, T][];
export function choose<T>(set: T[], n: 4): [T, T, T, T][];
export function choose<T>(set: T[], n: 5): [T, T, T, T, T][];
export function choose<T>(set: T[], n: number): T[][];
export function choose<T>(set: T[], n: number) {
    if (set.length < n || n < 1) return [];
    return chooseUtil([], n, set);
}

/**
 * Return an array of values which count from start to end (inclusive), by the given interval
 * @param start The number to start counting from
 * @param end The number to start when the count is about to reach
 * @param by The step size (default: 1)
 */
export function range(start: number, end: number, by = 1) {
    const rangeLength = Math.ceil((end - start) / by);
    if (!isFinite(rangeLength) || isNaN(rangeLength) || rangeLength < 0) {
        throw new Error(`Cannot count to ${end} from ${start} by ${by}s`);
    }

    return new Array(rangeLength).fill(0).map((_, i) => start + by * i);
}

/**
 * Removes duplicate elements from a list, e.g [1, 1, 2, 2, 3, 1] becomes [1, 2, 3]
 */
export function uniq<T>(set: T[]) {
    return set.filter((e, i) => set.indexOf(e) === i);
}
