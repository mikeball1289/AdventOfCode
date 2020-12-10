import { readFileSync } from 'fs';

type NestedArray<T> = T | NestedArray<T>[];

function fileSplitUtil<T>(splitTokens: (string | RegExp)[], text: string, processing: (input: string) => T): NestedArray<T> {
    if (splitTokens.length === 0) return processing(text);
    const [split, ...rest] = splitTokens;
    return text
        .split(split)
        .filter(l => l !== '')
        .map(part => fileSplitUtil(rest, part, processing));
}

type SplitToken = string | RegExp;

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
export function openAoC<T>(name: string, dimensions: (string | RegExp)[] = [], processing = (input: string) => input) {
    // Read file and normalize line endings
    const file = readFileSync(name, 'ascii').replace(/\r\n/g, '\n');
    return fileSplitUtil(dimensions, file, processing);
}

export function ints(input: string) {
    return parseInt(input, 10);
}
