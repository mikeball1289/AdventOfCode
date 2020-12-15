import { last } from '../../lib/math/settools';

export class NumberGame {
    constructor(
        public readonly time: number = 0,
        public readonly numberHistory: number[] = [],
        public readonly lastSpokenTimes: { [n: number]: number | undefined } = {},
    ) { }

    static fromStart(startingNumbers: number[]) {
        const spokenTimes = startingNumbers
            .slice(0, -1)
            .reduce((times: { [n: number]: number }, n, i) =>
                ({ ...times, [n]: i }), {});

        return new NumberGame(startingNumbers.length, startingNumbers, spokenTimes);
    }

    sayNumber(n: number): NumberGame {
        const lastNumber = last(this.numberHistory);
        return new NumberGame(
            this.time + 1,
            [...this.numberHistory, n],
            { ...this.lastSpokenTimes, ...(lastNumber === undefined ? {} : { [lastNumber]: this.time - 1 }) },
        );
    }

    getNextNumber(): number {
        const lastNumber = last(this.numberHistory);
        if (lastNumber === undefined) {
            throw new Error('Can\'t compute next number with no number history');
        }
        const lastSpoken = this.lastSpokenTimes[lastNumber];
        return lastSpoken === undefined ? 0 : (this.time - lastSpoken - 1);
    }

    playUntilTime(time: number): NumberGame {
        if (time <= this.time) {
            return this;
        }
        return this.sayNumber(this.getNextNumber()).playUntilTime(time);
    }
}
