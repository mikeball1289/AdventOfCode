import { convertToInstructionLabel, CPU, Instruction, InstructionLabel } from '../../lib/CPU';
import { openAoC } from '../../lib/input/openAoC';

describe('Day 8 - Handheld Halting', () => {
    test('Part 1 solves', () => {
        const input = openAoC('./input/day8input.txt', ['\n', ' ']);
        const program = input.map(([label, argument]): Instruction => ({
            label: convertToInstructionLabel(label), argument: parseInt(argument, 10)
        }));

        const cpu = new CPU(program);

        // get the accumulator right before the program loops
        expect(cpu.halts().cpu.accumulator).toBe(1446);
    });

    test('Part 2 solves', () => {
        const input = openAoC('./input/day8input.txt', ['\n', ' ']);
        const program = input.map(([label, argument]): Instruction => ({
            label: convertToInstructionLabel(label), argument: parseInt(argument, 10)
        }));

        // generate all possible programs that swap a single jmp for nop and vice versa
        const alternatePrograms = program
            // enumerate instructions so we remember their index later
            .map((instruction, i) => [instruction, i] as [Instruction, number])
            // don't consider acc instructions
            .filter(([instruction]) => instruction.label !== InstructionLabel.ACC)
            // for each remaining instruction, create a program with that instruction flipped between jmp-nop
            .map(([jmprnop, originalIndex]) => program.map((instruction, i) =>
                i === originalIndex ? {
                    argument: jmprnop.argument,
                    label: jmprnop.label === InstructionLabel.JMP ? InstructionLabel.NOP : InstructionLabel.JMP
                } : instruction));

        // find the amended programs that end up halting
        const result = alternatePrograms
            .map(ap => new CPU(ap).halts())
            .filter(haltResult => haltResult.halts)
            .map(haltResult => haltResult.cpu.accumulator);

        expect(result).toStrictEqual([1403]);
    });
});
