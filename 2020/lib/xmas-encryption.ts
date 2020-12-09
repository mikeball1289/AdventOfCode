function partialSumUtil(subset: number[], target: number, partialSum = 0, considerUpTo = 0): number | undefined {
    if (considerUpTo >= subset.length) return undefined;
    const nextSum = partialSum + subset[considerUpTo];
    if (nextSum > target) return undefined;
    if (nextSum === target) return considerUpTo + 1;
    return partialSumUtil(subset, target, nextSum, considerUpTo + 1);
}

function findSubset(data: number[], target: number) {
    const sumToIndex = partialSumUtil(data, target);
    if (sumToIndex !== undefined) {
        return data.slice(0, sumToIndex);
    }
    return undefined;
}

export function findContinuousSubsetSum(data: number[], target: number) {
    return data
        .map((_, i) => findSubset(data.slice(i), target))
        .filter((d): d is number[] => d !== undefined);
}
