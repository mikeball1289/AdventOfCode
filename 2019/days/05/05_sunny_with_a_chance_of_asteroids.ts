import { ints, openAoC } from '../../../lib/input/openAoC';
import { IntCode } from '../../lib/IntCode';

const program = openAoC('./2019/input/day5input.txt', [','], ints);

const computer = new IntCode(program);

console.log(computer.buffer(1).execute().cpuState.stdout); // [0, 0, 0, 0, 0, 0, 0, 0, 0, 7839346]

console.log(computer.buffer(5).execute().cpuState.stdout); // [447803]
