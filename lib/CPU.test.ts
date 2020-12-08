import { convertToInstructionLabel, CPU, InstructionLabel } from './CPU';

describe('convertToInstructionLabel', () => {
    it('should throw an error when given an invalid instruction label', () => {
        const testFn = () => convertToInstructionLabel('none');

        expect(testFn).toThrowError();
    });

    it('should change the type from string to InstructionLabel if a conversion is possible', () => {
        const results = [
            convertToInstructionLabel('acc'),
            convertToInstructionLabel('jmp'),
            convertToInstructionLabel('nop'),
        ];

        expect(results).toStrictEqual(['acc', 'jmp', 'nop']);
    });
});

describe('CPU', () => {
    const program = [
        { label: InstructionLabel.ACC, argument: 1 },
        { label: InstructionLabel.JMP, argument: -1 },
        { label: InstructionLabel.NOP, argument: 99 },
    ];

    describe('constructor', () => {
        it('should construct with the given program', () => {
            const result = new CPU(program);

            expect(result).toBeDefined();
            expect(result.program).toStrictEqual(program);
            expect(result.pc).toBe(0);
            expect(result.accumulator).toBe(0);
        });

        it('should construct with an empty program', () => {
            const result = new CPU([]);

            expect(result).toBeDefined();
            expect(result.program).toStrictEqual([]);
            expect(result.pc).toBe(0);
            expect(result.accumulator).toBe(0);
        });

        it('should construct with partial state', () => {
            const result = new CPU(program, 10, -10);

            expect(result).toBeDefined();
            expect(result.program).toStrictEqual(program);
            expect(result.pc).toBe(10);
            expect(result.accumulator).toBe(-10);
        });
    });

    describe('step', () => {
        it('should advance the cpu to the next state after running the current acc instruction', () => {
            const cpu = new CPU(program).step();

            expect(cpu.pc).toBe(1);
            expect(cpu.accumulator).toBe(1);
        });

        it('should advance the cpu to the next state after running the current jmp instruction', () => {
            const cpu = new CPU(program, 1, 1).step();

            expect(cpu.pc).toBe(0);
            expect(cpu.accumulator).toBe(1);
        });

        it('should advance the cpu to the next state after running the current nop instruction', () => {
            const cpu = new CPU(program, 2, 1).step();

            expect(cpu.pc).toBe(3);
            expect(cpu.accumulator).toBe(1);
        });

        it('should do nothing if the program counter isn\'t on an instruction', () => {
            const cpu = new CPU(program, 3, 1).step();

            expect(cpu).toStrictEqual(cpu);
        });
    });

    describe('halted', () => {
        it('should be false when stepping the cpu will do something', () => {
            const cpu = new CPU(program, 2, 1);

            expect(cpu.halted).toBe(false);
        });

        it('should be true when stepping the cpu will do nothing', () => {
            const cpu = new CPU(program, 3, 1);

            expect(cpu.halted).toBe(true);
        });
    });

    describe('halts', () => {
        it('should compute the end state of a program that eventually halts', () => {
            const cpu = new CPU([
                { label: InstructionLabel.ACC, argument: 1 },
                { label: InstructionLabel.JMP, argument: 2 },
                { label: InstructionLabel.JMP, argument: 2 },
                { label: InstructionLabel.JMP, argument: -1 },
                { label: InstructionLabel.ACC, argument: 3 },
                { label: InstructionLabel.NOP, argument: 3 },
            ]);

            const result = cpu.halts();

            expect(result.cpu.accumulator).toBe(4);
            expect(result.halts).toBe(true);
        });

        it('should detect when a program will not halt, and return the state right before a loop', () => {
            const cpu = new CPU(program);

            const result = cpu.halts();

            expect(result.cpu.accumulator).toBe(1);
            expect(result.halts).toBe(false);
        });
    });
});
