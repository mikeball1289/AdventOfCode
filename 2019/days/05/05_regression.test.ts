import { ints, openAoC } from '../../../lib/input/openAoC';
import { IntCode } from '../../lib/IntCode';

describe('Day 5 - Sunny with a Chance of Asteroids', () => {
    test('Part 1 solves', () => {
        const program = openAoC('./2019/input/day5input.txt', [','], ints);

        const computer = new IntCode(program);

        expect(computer.buffer(1).execute().cpuState.stdout).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 7839346]);
    });

    test('Part 2 solves', () => {
        const program = openAoC('./2019/input/day5input.txt', [','], ints);

        const computer = new IntCode(program);

        expect(computer.buffer(5).execute().cpuState.stdout).toStrictEqual([447803]);
    });
});
