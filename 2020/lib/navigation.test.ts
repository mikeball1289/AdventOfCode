import { Point } from '../../lib/math/Point';
import { applyNavigationInstruction, applyWaypointInstruction, NavigationAction, NavigationInstruction, parseNavigationInstruction, Ship, shipDirection, WaypointShip } from './navigation';

describe('parseNavigationInstruction', () => {
    it('should return the action represented by the given string', () => {
        const testInputs = ['F10', 'N3', 'F7', 'R90', 'F11'];

        const result = testInputs.map(parseNavigationInstruction);

        const expectedResults: NavigationInstruction[] = [
            { action: NavigationAction.FORWARD, value: 10 },
            { action: NavigationAction.NORTH, value: 3 },
            { action: NavigationAction.FORWARD, value: 7 },
            { action: NavigationAction.RIGHT, value: 90 },
            { action: NavigationAction.FORWARD, value: 11 },
        ];

        expect(result).toStrictEqual(expectedResults);
    });

    it('should throw an error if the action is invalid', () => {
        expect(() => parseNavigationInstruction('J42')).toThrowError();
    });

    it('should throw an error when rotating by a non-90 degree interval', () => {
        expect(() => parseNavigationInstruction('R45')).toThrowError();
    });
});

describe('applyNavigationInstruction', () => {
    it('should move the ship in the cardinal direction given', () => {
        const instructions: NavigationInstruction[] = [
            { action: NavigationAction.NORTH, value: 5 },
            { action: NavigationAction.SOUTH, value: 5 },
            { action: NavigationAction.EAST, value: 5 },
            { action: NavigationAction.WEST, value: 5 },
        ];

        const ship: Ship = {
            position: new Point(2, 3),
            facing: 0,
        };

        const results = instructions
            .map(inst => applyNavigationInstruction(ship, inst))
            .map(s => ({ facing: s.facing, posString: s.position.toString() }));

        const expectedResults = [
            { facing: 0, posString: '(2, 8)' },
            { facing: 0, posString: '(2, -2)' },
            { facing: 0, posString: '(7, 3)' },
            { facing: 0, posString: '(-3, 3)' },
        ];

        expect(results).toStrictEqual(expectedResults);
    });

    it('should move forward in the direction it\'s facing', () => {
        const result = applyNavigationInstruction(
            { facing: 90, position: new Point(1, 2) },
            { action: NavigationAction.FORWARD, value: 5 },
        );

        expect(result.facing).toBe(90);
        expect(result.position.x).toBe(1);
        expect(result.position.y).toBe(7);
    });

    it('should rotate the ship left and right', () => {
        const ship: Ship = { facing: 90, position: new Point(0, 0) };

        const instructions: NavigationInstruction[] = [
            { action: NavigationAction.LEFT, value: 90 },
            { action: NavigationAction.RIGHT, value: 180 },
            { action: NavigationAction.LEFT, value: 270 },
        ];

        const results = instructions
            .map(inst => applyNavigationInstruction(ship, inst))
            .map(s => s.facing);

        const expectedResults = [
            180,
            270,
            0,
        ];

        expect(results).toStrictEqual(expectedResults);
    });
});

describe('applyWaypointInstruction', () => {
    it('should move the waypoint in the cardinal direction given', () => {
        const instructions: NavigationInstruction[] = [
            { action: NavigationAction.NORTH, value: 5 },
            { action: NavigationAction.SOUTH, value: 5 },
            { action: NavigationAction.EAST, value: 5 },
            { action: NavigationAction.WEST, value: 5 },
        ];

        const ship: WaypointShip = {
            position: new Point(2, 3),
            waypoint: new Point(10, 1),
        };

        const results = instructions
            .map(inst => applyWaypointInstruction(ship, inst))
            .map(s => s.waypoint.toString());

        const expectedResults = [
            '(10, 6)',
            '(10, -4)',
            '(15, 1)',
            '(5, 1)',
        ];

        expect(results).toStrictEqual(expectedResults);
    });

    it('should move the ship towards the waypoint the given number of times', () => {
        const result = applyWaypointInstruction(
            { position: new Point(1, 2), waypoint: new Point(10, 1) },
            { action: NavigationAction.FORWARD, value: 5 },
        );

        expect(result.position.x).toBe(51);
        expect(result.position.y).toBe(7);
    });

    it('should rotate the waypoint left and right', () => {
        const ship: WaypointShip = { waypoint: new Point(10, 1), position: new Point(0, 0) };

        const instructions: NavigationInstruction[] = [
            { action: NavigationAction.LEFT, value: 90 },
            { action: NavigationAction.RIGHT, value: 180 },
            { action: NavigationAction.LEFT, value: 270 },
        ];

        const results = instructions
            .map(inst => applyWaypointInstruction(ship, inst))
            .map(s => s.waypoint.toString());

        const expectedResults = [
            '(-1, 10)',
            '(-10, -1)',
            '(1, -10)',
        ];

        expect(results).toStrictEqual(expectedResults);
    });
});

describe('shipDirection', () => {
    it('should throw an error if the ship isn\'t facing a cardinal direction', () => {
        expect(() => shipDirection({ facing: 45, position: new Point() })).toThrowError();
    });

    it('should return the compass direction that the ship is facing', () => {
        const testShips: Ship[] = [
            { facing: 0, position: new Point() },
            { facing: 90, position: new Point() },
            { facing: 180, position: new Point() },
            { facing: 270, position: new Point() },
        ];

        const results = testShips.map(shipDirection);

        const expectedResults = [
            NavigationAction.EAST,
            NavigationAction.NORTH,
            NavigationAction.WEST,
            NavigationAction.SOUTH,
        ];

        expect(results).toStrictEqual(expectedResults);
    });
});

it('should pass the first given test case', () => {
    const instructions = ['F10', 'N3', 'F7', 'R90', 'F11'].map(parseNavigationInstruction);
    const startingShip: Ship = {
        facing: 0,
        position: new Point(0, 0),
    };

    const result = instructions.reduce((ship: Ship, instruction) =>
        applyNavigationInstruction(ship, instruction), startingShip);

    expect(result.position.manhattanDistance).toBe(25);
});

it('should pass the second given test case', () => {
    const instructions = ['F10', 'N3', 'F7', 'R90', 'F11'].map(parseNavigationInstruction);
    const startingShip: WaypointShip = {
        waypoint: new Point(10, 1),
        position: new Point(0, 0),
    };

    const result = instructions.reduce((ship: WaypointShip, instruction) =>
        applyWaypointInstruction(ship, instruction), startingShip);

    expect(result.position.manhattanDistance).toBe(286);
});
