import { roughParse } from '../../lib/input/openAoC';
import { Map2d } from '../../lib/Map2d';
import { count } from '../../lib/math/settools';
import { SeatCA, SeatCell, seatCellChar } from './SeatCA';

const testSetupString =
    'L.LL.LL.LL\n' +
    'LLLLLLL.LL\n' +
    'L.L.L..L..\n' +
    'LLLL.LL.LL\n' +
    'L.LL.LL.LL\n' +
    'L.LLLLL.LL\n' +
    '..L.L.....\n' +
    'LLLLLLLLLL\n' +
    'L.LLLLLL.L\n' +
    'L.LLLLL.LL'
    ;

const testSetup = roughParse(testSetupString, ['\n', ''], seatCellChar);

describe('SeatCA', () => {
    describe('constructor', () => {
        it('should take an initial seat arrangement', () => {
            const result = new SeatCA(new Map2d(testSetup));

            expect(result).toBeDefined();
        });
    });

    describe('neighbors', () => {
        it('should return the list of neighbors around a given coordinate', () => {
            const setup = new SeatCA(new Map2d(testSetup));

            const result = setup.neighbors(2, 2);

            expect(result.length).toBe(8);
            expect(count(result, SeatCell.FLOOR)).toBe(2);
            expect(count(result, SeatCell.EMPTY_SEAT)).toBe(6);
        });

        it('should return fewer than 8 neighbors when on the edge', () => {
            const setup = new SeatCA(new Map2d(testSetup));

            const result = setup.neighbors(0, 2);

            expect(result.length).toBe(5);
            expect(count(result, SeatCell.FLOOR)).toBe(1);
            expect(count(result, SeatCell.EMPTY_SEAT)).toBe(4);
        });

        it('should return no neighbors if the coord is completely off the grid', () => {
            const setup = new SeatCA(new Map2d(testSetup));

            const result = setup.neighbors(50, 50);

            expect(result).toStrictEqual([]);
        });
    });

    describe('linesOfSight', () => {
        it('should return the first seat in each direction that the given coord can see', () => {
            const setupStrings = [
                '.............\n' +
                '.L.L.#.#.#.#.\n' +
                '.............',

                '.##.##.\n' +
                '#.#.#.#\n' +
                '##...##\n' +
                '...L...\n' +
                '##...##\n' +
                '#.#.#.#\n' +
                '.##.##.',
            ];

            const setups = setupStrings.map(t => new SeatCA(new Map2d(roughParse(t, ['\n', ''], seatCellChar))));

            const results = [
                setups[0].linesOfSight(1, 1),
                setups[0].linesOfSight(3, 1),
                setups[1].linesOfSight(3, 3),
            ];

            expect(count(results[0], SeatCell.EMPTY_SEAT)).toBe(1);
            expect(count(results[0], SeatCell.FILLED_SEAT)).toBe(0);
            expect(count(results[0], SeatCell.FLOOR)).toBe(7);

            expect(count(results[1], SeatCell.EMPTY_SEAT)).toBe(1);
            expect(count(results[1], SeatCell.FILLED_SEAT)).toBe(1);
            expect(count(results[1], SeatCell.FLOOR)).toBe(6);

            expect(count(results[2], SeatCell.EMPTY_SEAT)).toBe(0);
            expect(count(results[2], SeatCell.FILLED_SEAT)).toBe(0);
            expect(count(results[2], SeatCell.FLOOR)).toBe(8);
        });
    });

    describe('stepAdjacent', () => {
        it('should follow the rules of the cellular automaton\n' +
            '    If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.\n' +
            '    If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.\n' +
            '    Otherwise, the seat\'s state does not change.',
            () => {
                const expectedResults = [
                    '#.##.##.##\n' +
                    '#######.##\n' +
                    '#.#.#..#..\n' +
                    '####.##.##\n' +
                    '#.##.##.##\n' +
                    '#.#####.##\n' +
                    '..#.#.....\n' +
                    '##########\n' +
                    '#.######.#\n' +
                    '#.#####.##',

                    '#.LL.L#.##\n' +
                    '#LLLLLL.L#\n' +
                    'L.L.L..L..\n' +
                    '#LLL.LL.L#\n' +
                    '#.LL.LL.LL\n' +
                    '#.LLLL#.##\n' +
                    '..L.L.....\n' +
                    '#LLLLLLLL#\n' +
                    '#.LLLLLL.L\n' +
                    '#.#LLLL.##',

                    '#.##.L#.##\n' +
                    '#L###LL.L#\n' +
                    'L.#.#..#..\n' +
                    '#L##.##.L#\n' +
                    '#.##.LL.LL\n' +
                    '#.###L#.##\n' +
                    '..#.#.....\n' +
                    '#L######L#\n' +
                    '#.LL###L.L\n' +
                    '#.#L###.##',

                    '#.#L.L#.##\n' +
                    '#LLL#LL.L#\n' +
                    'L.L.L..#..\n' +
                    '#LLL.##.L#\n' +
                    '#.LL.LL.LL\n' +
                    '#.LL#L#.##\n' +
                    '..L.L.....\n' +
                    '#L#LLLL#L#\n' +
                    '#.LLLLLL.L\n' +
                    '#.#L#L#.##',
                ];

                const setup = new SeatCA(new Map2d(testSetup));

                const results = [1, 2, 3, 4].reduce((previousStates: SeatCA[], _) =>
                    [...previousStates, previousStates.slice(-1)[0].stepAdjacent()], [setup]);

                expect(results.slice(1).map(s => s.cells.toString())).toStrictEqual(expectedResults);
            }
        );
    });

    describe('stepLineOfSight', () => {
        it('should follow the rules of the cellular automaton\n' +
            '    If a seat is empty (L) and there are no occupied seats in direct line of sight, the seat becomes occupied.\n' +
            '    If a seat is occupied (#) and five or more seats in direct line of sight are also occupied, the seat becomes empty.\n' +
            '    Otherwise, the seat\'s state does not change.',
            () => {
                const expectedResults = [
                    '#.##.##.##\n' +
                    '#######.##\n' +
                    '#.#.#..#..\n' +
                    '####.##.##\n' +
                    '#.##.##.##\n' +
                    '#.#####.##\n' +
                    '..#.#.....\n' +
                    '##########\n' +
                    '#.######.#\n' +
                    '#.#####.##',

                    '#.LL.LL.L#\n' +
                    '#LLLLLL.LL\n' +
                    'L.L.L..L..\n' +
                    'LLLL.LL.LL\n' +
                    'L.LL.LL.LL\n' +
                    'L.LLLLL.LL\n' +
                    '..L.L.....\n' +
                    'LLLLLLLLL#\n' +
                    '#.LLLLLL.L\n' +
                    '#.LLLLL.L#',

                    '#.L#.##.L#\n' +
                    '#L#####.LL\n' +
                    'L.#.#..#..\n' +
                    '##L#.##.##\n' +
                    '#.##.#L.##\n' +
                    '#.#####.#L\n' +
                    '..#.#.....\n' +
                    'LLL####LL#\n' +
                    '#.L#####.L\n' +
                    '#.L####.L#',

                    '#.L#.L#.L#\n' +
                    '#LLLLLL.LL\n' +
                    'L.L.L..#..\n' +
                    '##LL.LL.L#\n' +
                    'L.LL.LL.L#\n' +
                    '#.LLLLL.LL\n' +
                    '..L.L.....\n' +
                    'LLLLLLLLL#\n' +
                    '#.LLLLL#.L\n' +
                    '#.L#LL#.L#',

                    '#.L#.L#.L#\n' +
                    '#LLLLLL.LL\n' +
                    'L.L.L..#..\n' +
                    '##L#.#L.L#\n' +
                    'L.L#.#L.L#\n' +
                    '#.L####.LL\n' +
                    '..#.#.....\n' +
                    'LLL###LLL#\n' +
                    '#.LLLLL#.L\n' +
                    '#.L#LL#.L#',
                ];

                const setup = new SeatCA(new Map2d(testSetup));

                const results = [1, 2, 3, 4, 5].reduce((previousStates: SeatCA[], _) =>
                    [...previousStates, previousStates.slice(-1)[0].stepLineOfSight()], [setup]);

                expect(results.slice(1).map(s => s.cells.toString())).toStrictEqual(expectedResults);
            }
        );
    });
});

describe('seatCellChar', () => {
    it('should convert a char to the appropriate seat cell state', () => {
        expect(seatCellChar('.')).toBe(SeatCell.FLOOR);
        expect(seatCellChar('L')).toBe(SeatCell.EMPTY_SEAT);
        expect(seatCellChar('#')).toBe(SeatCell.FILLED_SEAT);
    });

    it('should throw an error when given an invalid string', () => {
        expect(() => seatCellChar('P')).toThrowError();
        expect(() => seatCellChar('LoL')).toThrowError();
    });
});
