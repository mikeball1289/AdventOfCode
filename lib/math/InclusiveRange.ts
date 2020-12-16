export class InclusiveRange {
    constructor(
        public readonly min: number,
        public readonly max: number,
    ) {
        if (min > max) {
            throw new Error(`Invald range (${min} > ${max})`);
        }
    }

    contains(n: number) {
        return n >= this.min && n <= this.max;
    }

    overlaps(other: InclusiveRange) {
        return this.contains(other.min) || other.contains(this.min);
    }

    combine(other: InclusiveRange) {
        if (!this.overlaps(other)) {
            throw new Error('Cannot combine distinct ranges');
        }
        return new InclusiveRange(Math.min(this.min, other.min), Math.max(this.max, other.max));
    }
}
