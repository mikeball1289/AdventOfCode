export enum InstructionLabel {
    ACC = 'acc',
    JMP = 'jmp',
    NOP = 'nop',
}

const instructionLabels = Object.values(InstructionLabel);

export function convertToInstructionLabel(label: string): InstructionLabel {
    if (!instructionLabels.includes(label as InstructionLabel)) {
        throw new Error(`Invalid instruction: ${label}`);
    }
    return label as InstructionLabel;
}

export interface Instruction {
    label: InstructionLabel;
    argument: number;
}

function doACC(cpu: CPU, arg: number) {
    return new CPU(
        cpu.program,
        cpu.pc + 1,
        cpu.accumulator + arg,
    );
}

function doJMP(cpu: CPU, arg: number) {
    return new CPU(
        cpu.program,
        cpu.pc + arg,
        cpu.accumulator,
    );
}

function doNOP(cpu: CPU, arg: number) {
    return new CPU(
        cpu.program,
        cpu.pc + 1,
        cpu.accumulator,
    );
}

export class CPU {
    constructor(public readonly program: Instruction[], public readonly pc = 0, public readonly accumulator = 0) { }

    get halted() {
        return this.pc < 0 || this.pc >= this.program.length;
    }

    step() {
        if (this.halted) {
            return this;
        }

        const { label, argument } = this.program[this.pc];

        switch (label) {
            case InstructionLabel.ACC: return doACC(this, argument);
            case InstructionLabel.JMP: return doJMP(this, argument);
            case InstructionLabel.NOP: return doNOP(this, argument);
        }
    }

    halts(visitedPCs: number[] = []): { cpu: CPU, halts: boolean } {
        if (this.halted) {
            return { cpu: this, halts: true };
        }
        if (visitedPCs.includes(this.pc)) {
            return { cpu: this, halts: false };
        }
        return this.step().halts([this.pc, ...visitedPCs]);
    }
}
