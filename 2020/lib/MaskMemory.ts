// This module depends heavily on bit-operations, bitwise operators won't be errors here
/* tslint:disable:no-bitwise */

import { count, zip } from '../../lib/math/settools';

/**
 * Applies a custom mask of Xs, 1s, and 0s to the given number
 */
export function applyMask(mask: string, n: number) {
    const onesMask = BigInt(parseInt(mask.replace(/X/g, '0'), 2));
    const zeroesMask = BigInt(parseInt(mask.replace(/X/g, '1'), 2));

    return Number((BigInt(n) & zeroesMask) | onesMask);
}

export function applyMemoryMask(mask: string, n: number): string {
    return mask
        .split('')
        .reverse()
        .map((c, i) => c === 'X' || c === '1' ? c : (Math.floor(n / Math.pow(2, i)) % 2).toFixed(0))
        .reverse()
        .join('');
}

const memRegex = /^mem\[(\d+)\]$/;

export function getMemoryAddress(memLine: string) {
    const match = memLine.match(memRegex);
    if (!match) {
        throw new Error(`${memLine} is not a valid memory set command`);
    }

    return parseInt(match[1], 10);
}

export function groupByMask(lines: string[][]) {
    return lines
        .reduce((sets: { mask: string, lines: { mem: number, value: number }[] }[], line: string[]) => {
            if (line[0] === 'mask') {
                return [...sets, { mask: line[1], lines: [] }];
            }
            const set = sets.slice(-1)[0];
            return [
                ...sets.slice(0, -1), {
                    ...set,
                    lines: [
                        ...set.lines, {
                            mem: getMemoryAddress(line[0]),
                            value: parseInt(line[1], 10),
                        }
                    ]
                }
            ];
        }, []);
}

function commonPrefix(strA: string, strB: string): string {
    const sameUpTo = zip(strA.split(''), strB.split('')).findIndex(([a, b]) => a !== b);
    return strA.slice(0, strB.length).slice(0, sameUpTo);
}

export class MaskMemory {
    constructor(
        public readonly prefix: string,
        public readonly value?: number,
        public readonly zero?: MaskMemory,
        public readonly one?: MaskMemory,
    ) { }

    static readonly EMPTY = new MaskMemory('');

    insert(memMask: string, value: number): MaskMemory {
        if (this.value === undefined && this.zero === undefined && this.one === undefined) {
            return new MaskMemory(memMask, value);
        }

        if (this.prefix === memMask) {
            return new MaskMemory(memMask, value, this.zero, this.one);
        }

        const prefix = commonPrefix(memMask, this.prefix);
        const currSuffix = this.prefix.slice(prefix.length);
        const currNext = currSuffix.charAt(0);
        const newSuffix = memMask.slice(prefix.length);
        const newNext = newSuffix.charAt(0);

        if (currSuffix === '') {
            return new MaskMemory(
                this.prefix,
                this.value,
                ['0', 'X'].includes(newNext) ? (this.zero ?? MaskMemory.EMPTY).insert(newSuffix.slice(1), value) : this.zero,
                ['1', 'X'].includes(newNext) ? (this.one ?? MaskMemory.EMPTY).insert(newSuffix.slice(1), value) : this.one,
            );
        }

        const currZero = ['0', 'X'].includes(currNext) ?
            new MaskMemory(currSuffix.slice(1), this.value, this.zero, this.one) :
            MaskMemory.EMPTY;

        const currOne = ['1', 'X'].includes(currNext) ?
            new MaskMemory(currSuffix.slice(1), this.value, this.zero, this.one) :
            MaskMemory.EMPTY;

        return new MaskMemory(
            prefix,
            undefined,
            ['0', 'X'].includes(newNext) ? currZero.insert(newSuffix.slice(1), value) : currZero,
            ['1', 'X'].includes(newNext) ? currOne.insert(newSuffix.slice(1), value) : currOne,
        );
    }

    sumContents(): number {
        const ownSum = (this.zero?.sumContents() ?? 0) + (this.one?.sumContents() ?? 0) + (this.value ?? 0);
        return ownSum * Math.pow(2, count(this.prefix.split(''), 'X'));
    }

    listContents(prefix = ''): string {
        return (this.value !== undefined ? `${prefix}${this.prefix}: ${this.value}\n` : '') +
            (this.zero?.listContents(prefix + this.prefix + '0') ?? '') +
            (this.one?.listContents(prefix + this.prefix + '1') ?? '');
    }
}
