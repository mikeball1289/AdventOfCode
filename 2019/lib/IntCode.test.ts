import { IntCode, OPCode } from './IntCode';

const testComputer = new IntCode([
    OPCode.ADD, 9, 10, 3,
    OPCode.MULT, 10, 11, 7,
    OPCode.HALT,
    1, 2, 3,
]);

describe('IntCode', () => {
    describe('constructor', () => {
        it('should construct with the given program', () => {
            const result = new IntCode([1, 2, 3]);

            expect(result.program).toStrictEqual([1, 2, 3]);
            expect(result.cpuState).toStrictEqual({
                pc: 0,
            });
        });

        it('should construct with an empty program', () => {
            const result = new IntCode([]);

            expect(result.program).toStrictEqual([]);
        });

        it('should construct with a partial CPU state', () => {
            const result = new IntCode([1, 2, 3], { pc: 5 });

            expect(result.cpuState).toStrictEqual({
                pc: 5,
            });
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

            expect(result.getAddress(3)).toBe(3);
            expect(result.cpuState).toStrictEqual({
                pc: 4,
            });
        });

        it('should run the current MULT instruction', () => {
            const result = testComputer.jump(4).step();

            expect(result.getAddress(7)).toBe(6);
            expect(result.cpuState).toStrictEqual({
                pc: 8,
            });
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
    });

    describe('execute', () => {
        it('should run the program to completion', () => {
            const result = testComputer.execute();

            expect(result.getAddress(3)).toBe(3);
            expect(result.getAddress(7)).toBe(6);
            expect(result.halted).toBe(true);
        });
    });

    it('runs the sample program', () => {
        const computer = new IntCode([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]);
        const result = computer.execute();

        expect(result.program).toStrictEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });
});
