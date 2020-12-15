import { last } from '../../../lib/math/settools';
import { NumberGame } from '../../lib/NumberGame';

const input = [9, 12, 1, 4, 17, 0, 18];

const game = NumberGame.fromStart(input);

console.log(last(game.playUntilTime(2020).numberHistory)); // 610

// Part two is solved in C, because even an impure fully optimized TS solution took multiple minutes to run
// see 15_rambunctious_recitation.c // 1407
