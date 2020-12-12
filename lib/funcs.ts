import { range } from './math/settools';

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

/**
 * Turns a list of predicate functions into a single function which decides if all the predicates are satisfied
 */
export function sat<T>(preds: ((input: T) => boolean)[]): (input: T) => boolean {
    return input => preds.reduce((sats: boolean, fn) => sats && fn(input), true);
}

type ArgsOf<T> = T extends (...args: infer ArgType) => any ? ArgType : never;

export function memoize<fnT extends (...args: any[]) => any>(fn: fnT, hasher?: (...args: ArgsOf<fnT>) => string): fnT {
    const lookup: { [hash: string]: ReturnType<fnT> } = {};
    const h = hasher ?? ((...rest: any[]) => rest.map(a => a.toString()).join(','));

    return ((...args: ArgsOf<fnT>) => {
        const hash = h(...args);
        return Object.prototype.hasOwnProperty.call(lookup, hash) ? lookup[hash] : lookup[hash] = fn(...args);
    }) as fnT;
}

/**
 * Creates a new function which applies the given function n number of times
 */
export function times<T>(fn: (a: T) => T, n: number): (a: T) => T {
    return a => range(0, n).reduce((result: T, _) => fn(result), a);
}
