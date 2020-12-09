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

export type Maybe<T> = T | undefined;
export function isSome<T>(thing: Maybe<T>): thing is T {
    return thing !== undefined;
}

export function maybeDo<A, R>(fn: (a: A) => R, a: Maybe<A>): Maybe<R>;
export function maybeDo<A, B, R>(fn: (a: A, b: B) => R, a: Maybe<A>, b: Maybe<B>): Maybe<R>;
export function maybeDo<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: Maybe<A>, b: Maybe<B>, c: Maybe<C>): Maybe<R>;
export function maybeDo<T, R>(fn: (...args: T[]) => R, ...rest: Maybe<T>[]): Maybe<R>;
export function maybeDo<T, R>(fn: (...args: T[]) => R, ...rest: Maybe<T>[]): Maybe<R> {
    if (rest.includes(undefined)) return undefined;
    return fn(...(rest as T[]));
}
