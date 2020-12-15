import { roughParse } from '../../lib/input/openAoC';
import { applyMask, applyMemoryMask, getMemoryAddress, groupByMask, MaskMemory } from './MaskMemory';

describe('applyMask', () => {
    it('should set 1 bits in the mask to 1s in the result', () => {
        const result = applyMask('11', 1);

        expect(result).toBe(3);
    });

    it('should set 0 bits in the mask to 0s in the result', () => {
        const result = applyMask('00', 1);

        expect(result).toBe(0);
    });

    it('should leave X bits in the mask alone in the result', () => {
        const result = applyMask('XX', 1);

        expect(result).toBe(1);
    });

    it('should pass the given test cases', () => {
        const testCases = [
            11,
            101,
            0,
        ];

        const testMask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X';

        const results = testCases.map(tc => applyMask(testMask, tc));

        const expectedResults = [
            73,
            101,
            64,
        ];

        expect(results).toStrictEqual(expectedResults);
    });
});

describe('applyMemoryMask', () => {
    it('should set 1 or X bits to the same thing in the output', () => {
        const result = applyMemoryMask('0000111XXX', 32);

        expect(result).toBe('0000111XXX');
    });

    it('should leave 0 bits alone', () => {
        const result = applyMemoryMask('00001X000', 10);

        expect(result).toBe('00001X010');
    });

    it('should pass the given test cases', () => {
        expect(applyMemoryMask('000000000000000000000000000000X1001X', 42)).toBe('000000000000000000000000000000X1101X');
        expect(applyMemoryMask('00000000000000000000000000000000X0XX', 26)).toBe('00000000000000000000000000000001X0XX');
    });
});

describe('getMemoryAddress', () => {
    it('should get the memory address from the expression', () => {
        expect(getMemoryAddress('mem[69]')).toBe(69);
        expect(getMemoryAddress('mem[420]')).toBe(420);
    });

    it('should throw an error when given an invalid mem set line', () => {
        expect(() => getMemoryAddress('asdasd')).toThrowError();
        expect(() => getMemoryAddress('mem[asd]')).toThrowError();
    });
});

describe('groupByMask', () => {
    it('should split the given imperative lines into a data structure where mem sets are nested in mask sets', () => {
        const lines = roughParse(
            'mask = 01X11X10X10110110X111X11010X1X101010\n' +
            'mem[19409] = 3025\n' +
            'mem[40104] = 798480382\n' +
            'mem[25359] = 905\n' +
            'mask = 01011X111100XX1100X1X10X110000000000\n' +
            'mem[55479] = 930785\n' +
            'mem[25548] = 130263864\n' +
            'mem[60518] = 202648\n' +
            'mem[11955] = 1138\n' +
            'mem[45248] = 753\n', ['\n', ' = ']);

        const result = groupByMask(lines);

        expect(result).toStrictEqual([{
            mask: '01X11X10X10110110X111X11010X1X101010',
            lines: [
                { mem: 19409, value: 3025 },
                { mem: 40104, value: 798480382 },
                { mem: 25359, value: 905 },
            ]
        }, {
            mask: '01011X111100XX1100X1X10X110000000000',
            lines: [
                { mem: 55479, value: 930785 },
                { mem: 25548, value: 130263864 },
                { mem: 60518, value: 202648 },
                { mem: 11955, value: 1138 },
                { mem: 45248, value: 753 },
            ]
        }] as ReturnType<typeof groupByMask>);
    });
});

describe('MaskMemory', () => {
    it('should track key value pairs in a trie, with fuzzy matching on Xs', () => {
        const mm = MaskMemory.EMPTY
            .insert('0X1', 1)
            .insert('00X', 2)
            .insert('X01', 3);

        expect(mm.sumContents()).toBe(9);
    });

    it('should accurately sum the values in the trie', () => {
        const mm = MaskMemory.EMPTY
            .insert('00XX', 1)
            .insert('01XX', 2);

        expect(mm.sumContents()).toBe(12);
    });

    it('should pass the given test case', () => {
        const mm = MaskMemory.EMPTY
            .insert(applyMemoryMask('000000000000000000000000000000X1001X', 42), 100)
            .insert(applyMemoryMask('00000000000000000000000000000000X0XX', 26), 1);

        expect(mm.sumContents()).toBe(208);
    });

    it('should be pretty efficienct', () => {
        const mm = MaskMemory.EMPTY
            .insert(applyMemoryMask('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X', 8), 11)
            .insert(applyMemoryMask('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X', 7), 101)
            .insert(applyMemoryMask('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X', 8), 0);

        // expect(mm.sumContents()).toBe(208);
        expect(mm.sumContents()).toBe(1735166787584);
    });

    it('should be able to list its contents', () => {
        const mm1 = MaskMemory.EMPTY
            .insert('0X1', 1)
            .insert('00X', 2)
            .insert('X01', 3);

        expect(mm1.listContents()).toBe(
            '000: 2\n' +
            '001: 3\n' +
            '011: 1\n' +
            '101: 3\n'
        );

        const mm2 = MaskMemory.EMPTY
            .insert(applyMemoryMask('000000000000000000000000000000X1001X', 42), 100)
            .insert(applyMemoryMask('00000000000000000000000000000000X0XX', 26), 1);

        expect(mm2.listContents()).toBe(
            '0000000000000000000000000000000100XX: 1\n' +
            '00000000000000000000000000000001100X: 1\n' +
            '00000000000000000000000000000001101X: 1\n' +
            '00000000000000000000000000000011101X: 100\n'
        );
    });
});
