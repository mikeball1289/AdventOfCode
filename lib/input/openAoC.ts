import { readFileSync } from 'fs';

type NestedStringArray = string | NestedStringArray[];

function fileSplitUtil(splitTokens: (string | RegExp)[], text: string): NestedStringArray {
    if (splitTokens.length === 0) return text;
    const [split, ...rest] = splitTokens;
    return text
        .split(split)
        .filter(l => l !== '')
        .map(part => fileSplitUtil(rest, part));
}

type SplitToken = string | RegExp;

export function openAoC(name: string): string;
export function openAoC(name: string, dimensions: [SplitToken]): string[];
export function openAoC(name: string, dimensions: [SplitToken, SplitToken]): string[][];
export function openAoC(name: string, dimensions: [SplitToken, SplitToken, SplitToken]): string[][][];
export function openAoC(name: string, dimensions: [SplitToken, SplitToken, SplitToken, SplitToken]): string[][][][];
export function openAoC(name: string, dimensions?: (string | RegExp)[]): NestedStringArray;
export function openAoC(name: string, dimensions: (string | RegExp)[] = []) {
    // Read file and normalize line endings
    const file = readFileSync(name, 'ascii').replace(/\r\n/g, '\n');
    return fileSplitUtil(dimensions, file);
}
