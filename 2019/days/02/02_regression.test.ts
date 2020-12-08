import { openAoC } from '../../../lib/input/openAoC';
import { range } from '../../../lib/math/settools';
import { IntCode } from '../../lib/IntCode';

describe('Day 2 - 1202 Program Alarm', () => {
    test('Part 1 solves', () => {
        const inputText = openAoC('./2019/input/day2input.txt', [',']);
        const program = inputText.map(n => parseInt(n, 10));
        const computer = new IntCode(program);

        const result = computer.setAddress(1, 12).setAddress(2, 2).execute();
        expect(result.getAddress(0)).toBe(5866663);
    });

    test('Part 2 solves', () => {
        const inputText = openAoC('./2019/input/day2input.txt', [',']);
        const program = inputText.map(n => parseInt(n, 10));
        const computer = new IntCode(program);

        const inputs = range(0, 10000, 1).map(n => [Math.floor(n / 100), n % 100] as [number, number]);
        const results = inputs.map(input => ({
            result: computer.setAddress(1, input[0]).setAddress(2, input[1]).execute(),
            input,
        }));

        const successfulResults = results.filter(res => res.result.getAddress(0) === 19690720);
        expect(successfulResults.map(({ input }) => input)).toStrictEqual([[42, 59]]);
    });
});
