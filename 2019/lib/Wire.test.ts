import { isSome, maybeDo } from '../../lib/funcs';
import { Point } from '../../lib/math/Point';
import { cross } from '../../lib/math/settools';
import { distanceAlongPath, parseWiresFromPath, Wire, WireDirection } from './Wire';

describe('Wire', () => {
    describe('constructor', () => {
        it('should take the wire\'s properties', () => {
            const result = new Wire(new Point(), WireDirection.HORIZONTAL, 5);

            expect(result.start.x).toBe(0);
            expect(result.start.y).toBe(0);
            expect(result.direction).toBe(WireDirection.HORIZONTAL);
            expect(result.length).toBe(5);
        });
    });

    describe('fromText', () => {
        it('should throw an error when parsing invalid text', () => {
            expect(() => Wire.fromText('A123', new Point())).toThrowError();
            expect(() => Wire.fromText('Uabc', new Point())).toThrowError();
        });

        it('should properly parse wire text', () => {
            expect(Wire.fromText('U10', new Point()).direction).toBe(WireDirection.VERTICAL);
            expect(Wire.fromText('L10', new Point()).length).toBe(-10);
            expect(Wire.fromText('D4', new Point(1, 1)).end.y).toBe(-3);
        });
    });

    describe('perpendicularCoord', () => {
        it('should be the x coordinate for vertical wires', () => {
            const wire = new Wire(new Point(1, 2), WireDirection.VERTICAL, 4);

            expect(wire.perpendicularCoord).toBe(1);
        });

        it('should be the y coordinate for horizontal wires', () => {
            const wire = new Wire(new Point(1, 2), WireDirection.HORIZONTAL, 4);

            expect(wire.perpendicularCoord).toBe(2);
        });
    });

    describe('parallelCoord', () => {
        it('should be the x coordinate for horizontal wires', () => {
            const wire = new Wire(new Point(1, 2), WireDirection.HORIZONTAL, 4);

            expect(wire.parallelCoord).toBe(1);
        });

        it('should be the y coordinate for vertical wires', () => {
            const wire = new Wire(new Point(1, 2), WireDirection.VERTICAL, 4);

            expect(wire.parallelCoord).toBe(2);
        });
    });

    describe('intersection', () => {
        it('should return the point where two intersecting wires intersect', () => {
            const wireA = new Wire(new Point(1, 2), WireDirection.HORIZONTAL, 5);
            const wireB = new Wire(new Point(3, 0), WireDirection.VERTICAL, 6);

            const result = wireA.intersection(wireB);

            expect(result?.x).toBe(3);
            expect(result?.y).toBe(2);
        });

        it('should be commutative', () => {
            const wireA = new Wire(new Point(1, 2), WireDirection.HORIZONTAL, 5);
            const wireB = new Wire(new Point(3, 0), WireDirection.VERTICAL, 6);

            const resultA = wireA.intersection(wireB);
            const resultB = wireB.intersection(wireA);
            expect(resultA).toBeDefined();
            expect(resultB).toBeDefined();
            expect(resultA?.x).toBe(resultB?.x);
            expect(resultA?.y).toBe(resultB?.y);
        });

        it('should return undefined if the wires don\'t cross', () => {
            const wireA = new Wire(new Point(10, 2), WireDirection.HORIZONTAL, 5);
            const wireB = new Wire(new Point(3, 0), WireDirection.VERTICAL, 6);

            const result = wireA.intersection(wireB);

            expect(result).toBe(undefined);
        });

        it('should return undefined if the wires are parallel', () => {
            const wireA = new Wire(new Point(10, 2), WireDirection.HORIZONTAL, 5);
            const wireB = new Wire(new Point(3, 0), WireDirection.HORIZONTAL, 6);

            const result = wireA.intersection(wireB);

            expect(result).toBe(undefined);
        });
    });

    describe('containsPoint', () => {
        it('should return undefined if the point isn\'t on the same line as the wire', () => {
            expect(new Wire(new Point(), WireDirection.HORIZONTAL, 3).containsPoint(new Point(0, 1))).toBeUndefined();
            expect(new Wire(new Point(), WireDirection.VERTICAL, 3).containsPoint(new Point(1, 0))).toBeUndefined();
        });

        it('should return undefined if the point is outside the bounds of the wire', () => {
            expect(new Wire(new Point(), WireDirection.HORIZONTAL, 3).containsPoint(new Point(4, 0))).toBeUndefined();
            expect(new Wire(new Point(), WireDirection.VERTICAL, 3).containsPoint(new Point(0, 4))).toBeUndefined();
        });

        it('should return how many units along the wire the point is', () => {
            expect(new Wire(new Point(), WireDirection.HORIZONTAL, 3).containsPoint(new Point(2, 0))).toBe(2);
            expect(new Wire(new Point(), WireDirection.VERTICAL, 3).containsPoint(new Point(0, 2))).toBe(2);
        });
    });

    it('passes the given test cases for part 1', () => {
        const cases = [
            { path1: 'R8,U5,L5,D3', path2: 'U7,R6,D4,L4' },
            { path1: 'R75,D30,R83,U83,L12,D49,R71,U7,L72', path2: 'U62,R66,U55,R34,D71,R55,D58,R83' },
            { path1: 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', path2: 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7' },
        ];

        const results = cases
            .map(c => ({ path1: parseWiresFromPath(c.path1.split(',')), path2: parseWiresFromPath(c.path2.split(',')) }))
            .map(c => cross(c.path1, c.path2)
                .map(([wire1, wire2]) => wire1.intersection(wire2))
                .filter(isSome)
                .filter(p => !p.isOrigin())
                .map(p => Math.abs(p.x) + Math.abs(p.y)))
            .map(c => Math.min(...c));

        expect(results).toStrictEqual([6, 159, 135]);
    });

    it('passes the given test cases for part 2', () => {
        const cases = [
            { path1: 'R8,U5,L5,D3', path2: 'U7,R6,D4,L4' },
            { path1: 'R75,D30,R83,U83,L12,D49,R71,U7,L72', path2: 'U62,R66,U55,R34,D71,R55,D58,R83' },
            { path1: 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', path2: 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7' },
        ];

        const results = cases
            .map(c => ({ path1: parseWiresFromPath(c.path1.split(',')), path2: parseWiresFromPath(c.path2.split(',')) }))
            .map(c => cross(c.path1, c.path2)
                .map(([wire1, wire2]) => wire1.intersection(wire2))
                .filter(isSome)
                .filter(p => !p.isOrigin())
                .map(p => maybeDo((x, y) => x + y, distanceAlongPath(c.path1, p), distanceAlongPath(c.path2, p)))
                .filter(isSome))
            .map(c => Math.min(...c));

        expect(results).toStrictEqual([30, 610, 410]);
    });
});

describe('parseWiresFromPath', () => {
    it('should properly parse a path of wires', () => {
        const result = parseWiresFromPath('R8,U5,L5,D3'.split(','));

        expect(result.map(w => ({ x: w.end.x, y: w.end.y }))).toStrictEqual([
            { x: 8, y: 0 },
            { x: 8, y: 5 },
            { x: 3, y: 5 },
            { x: 3, y: 2 },
        ]);
    });
});

describe('distanceAlongPath', () => {
    it('should return undefined if the given point isn\'t on any wire in the path', () => {
        const path = parseWiresFromPath(['U4', 'R4', 'D2', 'L2']);

        expect(distanceAlongPath(path, new Point(1, 1))).toBeUndefined();
    });

    it('should return the unit distance along the path the given point is', () => {
        const path = parseWiresFromPath(['U4', 'R4', 'D2', 'L2']);

        expect(distanceAlongPath(path, new Point(4, 3))).toBe(9);
    });
});
