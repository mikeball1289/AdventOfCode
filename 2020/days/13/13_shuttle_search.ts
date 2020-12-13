import { ints, openAoC } from '../../../lib/input/openAoC';
import { minBy, reduction, sum } from '../../../lib/math/settools';
import { lcm, modDivide } from '../../../lib/math/tools';

const [[currentTime], schedules] = openAoC('./2020/input/day13input.txt', ['\n', ','], ints);

const realSchedules = schedules.filter(n => !isNaN(n));
const nextDeparture = minBy(realSchedules, n => n - (currentTime % n));
const leavingIn = nextDeparture - (currentTime % nextDeparture);

console.log(nextDeparture * leavingIn); // 156

function getPart(index: number, prod: number, cons: number) {
    const factor = prod / cons;
    return factor * modDivide(cons - index, factor, cons);
}

const totalProduct = reduction(schedules.filter(s => !isNaN(s)), lcm);
const parts = schedules.map((s, i) => isNaN(s) ? 0 : getPart(i, totalProduct, s));
console.log(sum(parts) % totalProduct); // 404517869995362
