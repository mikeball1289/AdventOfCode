import { IntCode, Mode, OPCode } from './IntCode';

const testComputer = new IntCode([
    /* 0 */ OPCode.ADD, 9, 11, 3,
    /* 4 */ OPCode.MULT, 10, 11, 7,
    /* 8 */ OPCode.HALT,
    /* 9 */ 1, 2, 3,

    /* 12 */ OPCode.IN, 13,
    /* 14 */ OPCode.OUT, 10,
    /* 16 */
]);

describe('IntCode', () => {
    describe('constructor', () => {
        it('should construct with the given program', () => {
            const result = new IntCode([1, 2, 3]);

            expect(result.program).toStrictEqual([1, 2, 3]);
            expect(result.cpuState.pc).toBe(0);
        });

        it('should construct with an empty program', () => {
            const result = new IntCode([]);

            expect(result.program).toStrictEqual([]);
        });

        it('should construct with a partial CPU state', () => {
            const result = new IntCode([1, 2, 3], { pc: 5 });

            expect(result.cpuState.pc).toBe(5);
        });
    });

    describe('getAddress', () => {
        it('should return the value at the specified address in program memory', () => {
            expect(testComputer.getAddress(4)).toBe(OPCode.MULT);
            expect(testComputer.getAddress(6)).toBe(11);
        });

        it('should return 0 if that address is uninitialized', () => {
            expect(testComputer.getAddress(9999)).toBe(0);
        });
    });

    describe('setAddress', () => {
        it('should return a new computer state with the given address set to the value', () => {
            const result = testComputer.setAddress(4, OPCode.HALT);

            expect(testComputer.getAddress(4)).toBe(OPCode.MULT);
            expect(result.getAddress(4)).toBe(OPCode.HALT);
        });
    });

    describe('getValue', () => {
        it('should return the value at the given offset when in immediate mode', () => {
            const result = testComputer.getValue(2, Mode.IMMEDIATE);

            expect(result).toBe(11);
        });

        it('should return the value at the position in memory indicated by the value at the given offset, when in position mode', () => {
            const result = testComputer.getValue(2, Mode.POSTITION);

            expect(result).toBe(3);
        });
    });

    describe('jump', () => {
        it('should return a new computer state with the program counter incremented by the given amount', () => {
            const result1 = testComputer.jump(3);
            const result2 = result1.jump(2);

            expect(result1.cpuState.pc).toBe(3);
            expect(result2.cpuState.pc).toBe(5);
        });

        it('should allow for backwards jumps as well', () => {
            const result1 = testComputer.jump(3);
            const result2 = result1.jump(-2);

            expect(result1.cpuState.pc).toBe(3);
            expect(result2.cpuState.pc).toBe(1);
        });
    });

    describe('jumpAbsolute', () => {
        it('should set the program counter to the given address', () => {
            const result = testComputer.jumpAbsolute(4);

            expect(result.cpuState.pc).toBe(4);
        });
    });

    describe('halted', () => {
        it('should indicate that the machine is halted when on a HALT instruction', () => {
            const result = testComputer.jump(8);

            expect(result.halted).toBe(true);
        });

        it('should indicate that the machine is not halted when not on a HALT instruction', () => {
            expect(testComputer.halted).toBe(false);
        });
    });

    describe('step', () => {
        it('should run the current ADD instruction', () => {
            const result = testComputer.step();

            expect(result.getAddress(3)).toBe(4);
            expect(result.cpuState.pc).toBe(4);
        });

        it('should run the current MULT instruction', () => {
            const result = testComputer.jump(4).step();

            expect(result.getAddress(7)).toBe(6);
            expect(result.cpuState.pc).toBe(8);
        });

        it('should do nothing if the machine is halted', () => {
            const haltedComputer = testComputer.jump(8);
            const result = haltedComputer.step();

            expect(result).toBe(haltedComputer);
        });

        it('should do nothing if the current instruction is invalid', () => {
            const invalidComputer = testComputer.jump(3);
            const result = invalidComputer.step();

            expect(result).toBe(invalidComputer);
        });

        it('should step over invalid instructions', () => {
            const computer = new IntCode([9999, 99]);

            const result = computer.step();

            expect(result.cpuState.pc).toBe(1);
            expect(result.halted).toBe(true);
        });

        it('should step over instructions with invalid modes', () => {
            const computer = new IntCode([301, 99]);

            const result = computer.step();

            expect(result.cpuState.pc).toBe(1);
            expect(result.halted).toBe(true);
        });
    });

    describe('execute', () => {
        it('should run the program to completion', () => {
            const result = testComputer.execute();

            expect(result.getAddress(3)).toBe(4);
            expect(result.getAddress(7)).toBe(6);
            expect(result.halted).toBe(true);
        });
    });

    describe('buffer', () => {
        it('should add a list of integers to the input buffer', () => {
            const result1 = testComputer.buffer(42, 69);
            expect(result1.cpuState.stdin).toStrictEqual([42, 69]);

            const result2 = result1.buffer();
            expect(result2.cpuState.stdin).toStrictEqual([42, 69]);

            const result3 = result2.buffer(420);
            expect(result3.cpuState.stdin).toStrictEqual([42, 69, 420]);
        });
    });

    describe('flush', () => {
        it('should clear the output buffer', () => {
            const result = new IntCode([], { stdout: [1, 2, 3] }).flush();

            expect(result.cpuState.stdout).toStrictEqual([]);
        });
    });

    describe('readInt', () => {
        it('should remove the next number from the input buffer', () => {
            const result = testComputer.buffer(42, 69).readInt();

            expect(result.cpuState.stdin).toStrictEqual([69]);
        });

        it('should leave the input buffer alone if nothing is there', () => {
            const result = testComputer.readInt();

            expect(result.cpuState.stdin).toStrictEqual([]);
        });
    });

    describe('writeInt', () => {
        it('should put an int into the output buffer', () => {
            const result = testComputer.writeInt(42);

            expect(result.cpuState.stdout).toStrictEqual([42]);
        });
    });

    describe('waiting', () => {
        it('should return true if the program is waiting for input', () => {
            const result = testComputer.jump(12).waiting;

            expect(result).toBe(true);
        });

        it('should return false if input is available', () => {
            const result = testComputer.jump(12).buffer(42).waiting;

            expect(result).toBe(false);
        });

        it('should return false if the program doesn\'t need input', () => {
            expect(testComputer.waiting).toBe(false);
        });
    });

    it('should run the first sample program', () => {
        const computer = new IntCode([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]);
        const result = computer.execute();

        expect(result.program).toStrictEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });

    it('should run the second sample program', () => {
        const computer = new IntCode([3, 0, 4, 0, 99], { stdin: [42] });
        const result = computer.execute();

        expect(result.cpuState).toStrictEqual({
            pc: 4,
            stdin: [],
            stdout: [42],
        });
        expect(result.halted).toBe(true);
    });

    it('should run the third sample program', () => {
        const computer = new IntCode([1002, 4, 3, 4, 33]);
        const result = computer.execute();

        expect(result.cpuState.pc).toBe(4);
        expect(result.getAddress(4)).toBe(99);
    });

    it('should run the sample compare and jump programs', () => {
        const positionEqualToTest = new IntCode([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]);
        const positionLessThanTest = new IntCode([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]);
        const immediateEqualToTest = new IntCode([3, 3, 1108, -1, 8, 3, 4, 3, 99]);
        const immediateLessThanTest = new IntCode([3, 3, 1107, -1, 8, 3, 4, 3, 99]);

        const positionJumpTest = new IntCode([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]);
        const immediateJumpTest = new IntCode([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]);

        expect(positionEqualToTest.buffer(8).execute().cpuState.stdout).toStrictEqual([1]);
        expect(positionEqualToTest.buffer(10).execute().cpuState.stdout).toStrictEqual([0]);

        expect(positionLessThanTest.buffer(5).execute().cpuState.stdout).toStrictEqual([1]);
        expect(positionLessThanTest.buffer(8).execute().cpuState.stdout).toStrictEqual([0]);
        expect(positionLessThanTest.buffer(10).execute().cpuState.stdout).toStrictEqual([0]);

        expect(immediateEqualToTest.buffer(8).execute().cpuState.stdout).toStrictEqual([1]);
        expect(immediateEqualToTest.buffer(10).execute().cpuState.stdout).toStrictEqual([0]);

        expect(immediateLessThanTest.buffer(5).execute().cpuState.stdout).toStrictEqual([1]);
        expect(immediateLessThanTest.buffer(8).execute().cpuState.stdout).toStrictEqual([0]);
        expect(immediateLessThanTest.buffer(10).execute().cpuState.stdout).toStrictEqual([0]);

        expect(positionJumpTest.buffer(12).execute().cpuState.stdout).toStrictEqual([1]);
        expect(positionJumpTest.buffer(0).execute().cpuState.stdout).toStrictEqual([0]);

        expect(immediateJumpTest.buffer(12).execute().cpuState.stdout).toStrictEqual([1]);
        expect(immediateJumpTest.buffer(0).execute().cpuState.stdout).toStrictEqual([0]);
    });

    it('should run the fourth sample program', () => {
        const computer = new IntCode([
            3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
            1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
            999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99
        ]);

        expect(computer.buffer(5).execute().cpuState.stdout).toStrictEqual([999]);
        expect(computer.buffer(8).execute().cpuState.stdout).toStrictEqual([1000]);
        expect(computer.buffer(10).execute().cpuState.stdout).toStrictEqual([1001]);
    });

});
