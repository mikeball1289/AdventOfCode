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

/**
 * Returns the unique intersection of two sets, e.g [1, 1, 2, 3] intersect [1, 1, 2, 2] becomes [1, 2]
 */
export function intersect<T>(setA: T[], setB: T[]) {
    return uniq(setA).filter(e => setB.includes(e));
}

/**
 * Computes the reduction of a set over some operation f
 * e.g the set [1, 2, 3] with the operator `+` reduces to 6
 */
export function reduction<T>(set: T[], f: (a: T, b: T) => T): T {
    if (set.length < 1) throw new Error('Cannot reduce empty set');
    const [head, ...tail] = set;
    return tail.reduce(f, head);
}

export function sum(list: number[]) {
    return list.reduce((a, b) => a + b, 0);
}

export function prod(list: number[]) {
    return list.reduce((a, b) => a * b, 1);
}

export function eq(list: any[]) {
    return list.length === 0 || !list.slice(1).some(el => el !== list[0]);
}

/**
 * Pairs each element in list1 with each element in list2
 */
export function cross<A, B>(list1: A[], list2: B[]): [A, B][] {
    return list1.flatMap(el1 => list2.map(el2 => [el1, el2] as [A, B]));
}

export function zip<A, B>(list1: A[], list2: B[]): [A, B][] {
    return list1.slice(0, Math.min(list1.length, list2.length)).map((el, i) => [el, list2[i]]);
}

/**
 * Groups blocks of continuous identical elements
 * e.g ['a', 'a', 'b', 'b', 'b', 'a', 'a'] -> [{ el: 'a', len: 2 }, { el: 'b', len: 3 }, { el: 'a', len: 2 }]
 */
export function blocks<T>(list: T[]): { el: T, len: number }[] {
    function groupInto(set: { el: T, len: number }[], item: T): { el: T, len: number }[] {
        if (set.length === 0) return [{ el: item, len: 1 }];
        const lastBlock = set.slice(-1)[0];
        if (item !== lastBlock.el) return [...set, { el: item, len: 1 }];
        return [...set.slice(0, -1), { el: item, len: lastBlock.len + 1 }];
    }

    return list.reduce((sets: { el: T, len: number }[], item) => groupInto(sets, item), []);
}

export function firstDifferences(list: number[]) {
    return zip(list, list.slice(1)).map(([a, b]) => b - a);
}

export const ascending = (a: number, b: number) => a - b;
export const descending = (a: number, b: number) => b - a;

export function count<T>(list: T[], el: T) {
    return list.filter(e => e === el).length;
}

export function countBy<T>(list: T[], pred: (el: T) => boolean) {
    return list.filter(pred).length;
}

export function minBy<T>(list: T[], mapping: (el: T, i: number, list: T[]) => number) {
    if (list.length === 0) throw new Error('No elements in list');
    const weightedList = list.map((el, i, l) => [el, mapping(el, i, l)] as [T, number]);
    return weightedList.slice(1).reduce((best, curr) => curr[1] < best[1] ? curr : best, weightedList[0])[0];
}

export function maxBy<T>(list: T[], mapping: (el: T, i: number, list: T[]) => number) {
    if (list.length === 0) throw new Error('No elements in list');
    const weightedList = list.map((el, i, l) => [el, mapping(el, i, l)] as [T, number]);
    return weightedList.slice(1).reduce((best, curr) => curr[1] > best[1] ? curr : best, weightedList[0])[0];
}

export function last<T>(list: T[]): T | undefined {
    return list.slice(-1)[0];
}
