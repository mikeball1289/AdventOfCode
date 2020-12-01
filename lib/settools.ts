function chooseUtil<T>(subset: T[], more: number, rest: T[]): T[][] {
    if (more === 0) return [subset];
    return rest.flatMap((el, i) => chooseUtil([...subset, el], more - 1, rest.slice(i + 1)));
}

export function choose<T>(set: T[], n: 1): [T][];
export function choose<T>(set: T[], n: 2): [T, T][];
export function choose<T>(set: T[], n: 3): [T, T, T][];
export function choose<T>(set: T[], n: 4): [T, T, T, T][];
export function choose<T>(set: T[], n: 5): [T, T, T, T, T][];
export function choose<T>(set: T[], n: number): T[][];
export function choose<T>(set: T[], n: number) {
    if (set.length < n) return [];
    return chooseUtil([], n, set);
}