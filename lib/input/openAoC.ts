import { readFileSync } from 'fs';

type NestedArray<T> = T | NestedArray<T>[];
type SplitToken = string | RegExp;

export function roughParse(text: string, dimensions: []): string;
export function roughParse<T>(text: string, dimensions: [], processing: (input: string) => T): T;
export function roughParse(text: string, dimensions: [SplitToken]): string[];
export function roughParse<T>(text: string, dimensions: [SplitToken], processing: (input: string) => T): T[];
export function roughParse(text: string, dimensions: [SplitToken, SplitToken]): string[][];
export function roughParse<T>(text: string, dimensions: [SplitToken, SplitToken], processing: (input: string) => T): T[][];
export function roughParse(text: string, dimensions: [SplitToken, SplitToken, SplitToken]): string[][][];
export function roughParse<T>(text: string, dimensions: [SplitToken, SplitToken, SplitToken], processing: (input: string) => T): T[][][];
export function roughParse(text: string, dimensions: [SplitToken, SplitToken, SplitToken, SplitToken]): string[][][][];
export function roughParse<T>(text: string, dimensions: [SplitToken, SplitToken, SplitToken, SplitToken], processing: (input: string) => T): T[][][][];
export function roughParse(text: string, splitTokens: SplitToken[]): NestedArray<string>;
export function roughParse<T>(text: string, splitTokens: SplitToken[], processing: (input: string) => T): NestedArray<T>;
export function roughParse(text: string, splitTokens: SplitToken[], processing = (input: string) => input) {
    if (splitTokens.length === 0) return processing(text);
    const [split, ...rest] = splitTokens;
    return text
        .split(split)
        .filter(l => l !== '')
        .map(part => roughParse(part, rest, processing));
}

export function openAoC(name: string): string;
export function openAoC(name: string, dimensions: [SplitToken]): string[];
export function openAoC<T>(name: string, dimensions: [SplitToken], processing: (input: string) => T): T[];
export function openAoC(name: string, dimensions: [SplitToken, SplitToken]): string[][];
export function openAoC<T>(name: string, dimensions: [SplitToken, SplitToken], processing: (input: string) => T): T[][];
export function openAoC(name: string, dimensions: [SplitToken, SplitToken, SplitToken]): string[][][];
export function openAoC<T>(name: string, dimensions: [SplitToken, SplitToken, SplitToken], processing: (input: string) => T): T[][][];
export function openAoC(name: string, dimensions: [SplitToken, SplitToken, SplitToken, SplitToken]): string[][][][];
export function openAoC<T>(name: string, dimensions: [SplitToken, SplitToken, SplitToken, SplitToken], processing: (input: string) => T): T[][][][];
export function openAoC(name: string, dimensions: (string | RegExp)[]): NestedArray<string>;
export function openAoC<T>(name: string, dimensions: (string | RegExp)[], processing: (input: string) => T): NestedArray<T>;
export function openAoC(name: string, dimensions: (string | RegExp)[] = [], processing = (input: string) => input) {
    // Read file and normalize line endings
    const file = readFileSync(name, 'ascii').replace(/\r\n/g, '\n');
    return roughParse(file, dimensions, processing);
}

export function ints(input: string) {
    return parseInt(input, 10);
}
