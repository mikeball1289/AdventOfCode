import { Point } from './Point';

describe('Point', () => {
    describe('constructor', () => {
        it('should store the given x and y coordinates', () => {
            const point = new Point(3, 4);

            expect(point.x).toBe(3);
            expect(point.y).toBe(4);
        });

        it('should default to (0, 0) if no coords are given', () => {
            const point = new Point();

            expect(point.x).toBe(0);
            expect(point.y).toBe(0);
        });
    });

    describe('toString', () => {
        it('should generate a coordinate string representing the point', () => {
            const point = new Point(3, 4);

            expect(point.toString()).toBe('(3, 4)');
        });
    });

    describe('equals', () => {
        it('should return true when comparing against a point at the same coords', () => {
            const p = new Point(Math.PI, Math.E);

            expect(new Point().equals(new Point())).toBe(true);
            expect(new Point(5, 4).equals(new Point(5, 4))).toBe(true);
            expect(p.equals(p)).toBe(true);
        });

        it ('should return false when comparing against a point at different coords', () => {
            const p = new Point(5, 4);

            expect(p.equals(new Point(3, 3))).toBe(false);
            expect(p.equals(new Point(5, 3))).toBe(false);
            expect(p.equals(new Point(3, 4))).toBe(false);
        });
    });
});
