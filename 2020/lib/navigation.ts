import { times } from '../../lib/funcs';
import { Point } from '../../lib/math/Point';

export enum NavigationAction {
    NORTH = 'N',
    SOUTH = 'S',
    EAST = 'E',
    WEST = 'W',
    LEFT = 'L',
    RIGHT = 'R',
    FORWARD = 'F',
}

export interface NavigationInstruction {
    action: NavigationAction;
    value: number;
}

export interface Ship {
    position: Point;
    facing: number;
}

export interface WaypointShip {
    position: Point;
    waypoint: Point;
}

const instructionRegex = /^([NSEWLRF])(\d+)$/;

export function parseNavigationInstruction(text: string): NavigationInstruction {
    const match = text.match(instructionRegex);
    if (!match) {
        throw new Error(`Instrction ${text} failed to parse`);
    }

    const action = match[1] as NavigationAction;
    const value = parseInt(match[2], 10);

    if ([NavigationAction.LEFT, NavigationAction.RIGHT].includes(action) && value % 90 !== 0) {
        throw new Error(`Can only rotate in 90 degree increments (${text} invalid rotation)`);
    }

    return { action, value };
}

function canonizeRotation(rot: number) {
    return ((rot % 360) + 360) % 360;
}

export function shipDirection(ship: Ship): NavigationAction.NORTH | NavigationAction.SOUTH | NavigationAction.EAST | NavigationAction.WEST {
    switch (ship.facing) {
        case 0: return NavigationAction.EAST;
        case 90: return NavigationAction.NORTH;
        case 180: return NavigationAction.WEST;
        case 270: return NavigationAction.SOUTH;
        default: throw new Error('Not facing in a cardinal direction');
    }
}

export function applyNavigationInstruction(ship: Ship, instruction: NavigationInstruction): Ship {
    switch (instruction.action) {
        case NavigationAction.EAST:
            return {
                position: new Point(ship.position.x + instruction.value, ship.position.y),
                facing: ship.facing
            };
        case NavigationAction.WEST:
            return {
                position: new Point(ship.position.x - instruction.value, ship.position.y),
                facing: ship.facing
            };
        case NavigationAction.NORTH:
            return {
                position: new Point(ship.position.x, ship.position.y + instruction.value),
                facing: ship.facing
            };
        case NavigationAction.SOUTH:
            return {
                position: new Point(ship.position.x, ship.position.y - instruction.value),
                facing: ship.facing
            };
        case NavigationAction.LEFT:
            return {
                position: new Point(ship.position.x, ship.position.y),
                facing: canonizeRotation(ship.facing + instruction.value),
            };
        case NavigationAction.RIGHT:
            return {
                position: new Point(ship.position.x, ship.position.y),
                facing: canonizeRotation(ship.facing - instruction.value),
            };
        case NavigationAction.FORWARD:
            return applyNavigationInstruction(ship, { action: shipDirection(ship), value: instruction.value });
    }
}

export function applyWaypointInstruction(ship: WaypointShip, instruction: NavigationInstruction): WaypointShip {
    switch (instruction.action) {
        case NavigationAction.EAST:
            return {
                ...ship,
                waypoint: new Point(ship.waypoint.x + instruction.value, ship.waypoint.y),
            };
        case NavigationAction.WEST:
            return {
                ...ship,
                waypoint: new Point(ship.waypoint.x - instruction.value, ship.waypoint.y),
            };
        case NavigationAction.NORTH:
            return {
                ...ship,
                waypoint: new Point(ship.waypoint.x, ship.waypoint.y + instruction.value),
            };
        case NavigationAction.SOUTH:
            return {
                ...ship,
                waypoint: new Point(ship.waypoint.x, ship.waypoint.y - instruction.value),
            };
        case NavigationAction.LEFT:
            return {
                ...ship,
                waypoint: times((p: Point) => p.rotateLeft(), instruction.value / 90)(ship.waypoint),
            };
        case NavigationAction.RIGHT:
            return {
                ...ship,
                waypoint: times((p: Point) => p.rotateRight(), instruction.value / 90)(ship.waypoint),
            };
        case NavigationAction.FORWARD:
            return {
                ...ship,
                position: new Point(
                    ship.position.x + ship.waypoint.x * instruction.value,
                    ship.position.y + ship.waypoint.y * instruction.value,
                ),
            };
    }
}
