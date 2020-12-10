import { memoize } from '../../lib/funcs';
import { firstDifferences } from '../../lib/math/settools';

function isValidSequence(adapterSequence: number[]) {
    return !firstDifferences(adapterSequence).some(n => n > 3);
}

export const countAlternativeSequences = memoize((sequence: number[]): number => {
    if (!isValidSequence(sequence)) return 0;
    if (sequence.length <= 2) return 1;
    return countAlternativeSequences(sequence.slice(1)) + countAlternativeSequences([sequence[0], ...sequence.slice(2)]);
});
