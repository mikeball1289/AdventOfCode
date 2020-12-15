import { last } from '../../../lib/math/settools';
import { NumberGame } from '../../lib/NumberGame';

describe('Day 15 - Rambunctious Recitation', () => {
    test('Part 1 solves', () => {
        const input = [9, 12, 1, 4, 17, 0, 18];

        const game = NumberGame.fromStart(input);

        expect(last(game.playUntilTime(2020).numberHistory)).toBe(610);
    });

    test.skip('Part 2 solves', () => {
        expect(true).toBe(false);
    });
});
