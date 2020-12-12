import { openAoC } from '../../../lib/input/openAoC';
import { Point } from '../../../lib/math/Point';
import { applyNavigationInstruction, applyWaypointInstruction, parseNavigationInstruction, Ship, WaypointShip } from '../../lib/navigation';

const instructions = openAoC('./2020/input/day12input.txt', ['\n'], parseNavigationInstruction);

const startingShip: Ship = {
    facing: 0,
    position: new Point(0, 0),
};

const part1Result = instructions.reduce((ship: Ship, instruction) =>
    applyNavigationInstruction(ship, instruction), startingShip);

console.log(part1Result.position.manhattanDistance); // 1710

const startingWaypointShip: WaypointShip = {
    waypoint: new Point(10, 1),
    position: new Point(0, 0),
};

const part2Result = instructions.reduce((ship: WaypointShip, instruction) =>
    applyWaypointInstruction(ship, instruction), startingWaypointShip);

console.log(part2Result.position.manhattanDistance); // 62045
