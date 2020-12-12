import { openAoC } from '../../../lib/input/openAoC';
import { Point } from '../../../lib/math/Point';
import { applyNavigationInstruction, applyWaypointInstruction, parseNavigationInstruction, Ship, WaypointShip } from '../../lib/navigation';

describe('Day 12 - Rain Risk', () => {
    test('Part 1 solves', () => {
        const instructions = openAoC('./2020/input/day12input.txt', ['\n'], parseNavigationInstruction);

        const startingShip: Ship = {
            facing: 0,
            position: new Point(0, 0),
        };

        const part1Result = instructions.reduce((ship: Ship, instruction) =>
            applyNavigationInstruction(ship, instruction), startingShip);

        expect(part1Result.position.manhattanDistance).toBe(1710);
    });

    test('Part 2 solves', () => {
        const instructions = openAoC('./2020/input/day12input.txt', ['\n'], parseNavigationInstruction);

        const startingWaypointShip: WaypointShip = {
            waypoint: new Point(10, 1),
            position: new Point(0, 0),
        };

        const part2Result = instructions.reduce((ship: WaypointShip, instruction) =>
            applyWaypointInstruction(ship, instruction), startingWaypointShip);

        expect(part2Result.position.manhattanDistance).toBe(62045);
    });
});
