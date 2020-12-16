import { last } from '../../lib/math/settools';
import { NumberGame } from './NumberGame';

describe('NumberGame', () => {
    describe('constructor', () => {
        it('should construct with a time and number history', () => {
            expect(new NumberGame()).toBeDefined();
            expect(new NumberGame(3, [1, 2], { [4]: 5, [6]: 7 })).toBeDefined();
        });
    });

    describe('fromStart', () => {
        it('should create a number game with the given spoken history', () => {
            const result = NumberGame.fromStart([0, 3, 6]);

            expect(result.time).toBe(3);
            expect(result.lastSpokenTimes).toStrictEqual({
                [0]: 0,
                [3]: 1,
            });
            expect(result.numberHistory).toStrictEqual([0, 3, 6]);
        });
    });

    describe('sayNumber', () => {
        it('should add the spoken number to the history and increment the time', () => {
            const result = NumberGame.fromStart([0, 3, 6]).sayNumber(4);

            expect(result.time).toBe(4);
            expect(result.lastSpokenTimes).toStrictEqual({
                [0]: 0,
                [3]: 1,
                [6]: 2,
            });
            expect(result.numberHistory).toStrictEqual([0, 3, 6, 4]);
        });

        it('should update the last time the number was spoken, if it was spoken before', () => {
            const result = NumberGame.fromStart([0, 3, 6]).sayNumber(3).sayNumber(4);

            expect(result.time).toBe(5);
            expect(result.lastSpokenTimes).toStrictEqual({
                [0]: 0,
                [3]: 3,
                [6]: 2,
            });
            expect(result.numberHistory).toStrictEqual([0, 3, 6, 3, 4]);
        });

        it('should be able to say the first number', () => {
            const result = new NumberGame().sayNumber(42);

            expect(result.time).toBe(1);
            expect(result.numberHistory).toStrictEqual([42]);
        });
    });

    describe('getNextNumber', () => {
        it('should compute the number to be spoken', () => {
            const result = NumberGame.fromStart([0, 3, 6]);

            expect(result.getNextNumber()).toBe(0);
            expect(result.sayNumber(0).getNextNumber()).toBe(3);
        });

        it('should throw an error if there is no number history to compute from', () => {
            expect(() => new NumberGame().getNextNumber()).toThrowError();
        });
    });

    describe('playUntilTime', () => {
        it('should progress the game until the given time step', () => {
            const game = NumberGame.fromStart([0, 3, 6]);
            const result = game.playUntilTime(10);

            expect(result.numberHistory).toStrictEqual([0, 3, 6, 0, 3, 3, 1, 0, 4, 0]);
        });
    });

    it('should pass the given test cases', () => {
        const testStarts = [
            [1, 3, 2],
            [2, 1, 3],
            [1, 2, 3],
            [2, 3, 1],
            [3, 2, 1],
            [3, 1, 2],
        ];

        const results = testStarts.map(start => last(NumberGame.fromStart(start).playUntilTime(2020).numberHistory));

        const expectedResults = [1, 10, 27, 78, 438, 1836];

        expect(results).toStrictEqual(expectedResults);
    });
});
