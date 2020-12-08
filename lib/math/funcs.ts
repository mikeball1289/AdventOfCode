/**
 * Repeatedly apply a function until it reaches a fixed point
 * @param fn The function to find the fixed point of
 * @param initialValue The value to start iterating from
 */
export function converge<T>(
    fn: (t: T) => T,
    initialValue: T,
    comparator: (a: T, b: T) => boolean = (a, b) => a === b,
): T {
    const next = fn(initialValue);
    if (comparator(initialValue, next)) return next;
    return converge(fn, next, comparator);
}
