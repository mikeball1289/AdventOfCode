import { ints, openAoC } from '../../../lib/input/openAoC';
import { range } from '../../../lib/math/settools';
import { IntCode } from '../../lib/IntCode';

const program = openAoC('./2019/input/day2input.txt', [','], ints);
const computer = new IntCode(program);

const result = computer.setAddress(1, 12).setAddress(2, 2).execute();
console.log(result.getAddress(0)); // 5866663

const inputs = range(0, 10000, 1).map(n => [Math.floor(n / 100), n % 100] as [number, number]);
const results = inputs.map(input => ({
    result: computer.setAddress(1, input[0]).setAddress(2, input[1]).execute(),
    input,
}));

const successfulResults = results.filter(res => res.result.getAddress(0) === 19690720);
console.log(successfulResults.map(({ input }) => input).toString()); // 42,59
