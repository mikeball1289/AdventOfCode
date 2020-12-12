import { converge } from '../../lib/funcs';
import { digits } from '../../lib/math/tools';

export interface CPU {
    pc: number;
    stdin: number[];
    stdout: number[];
}

export enum OPCode {
    ADD = 1,
    MULT = 2,
    IN = 3,
    OUT = 4,
    JUMP_TRUE = 5,
    JUMP_FALSE = 6,
    LESS_THAN = 7,
    EQUALS = 8,

    NOP = -1,
    HALT = 99,
}

export enum Mode {
    POSTITION = 0,
    IMMEDIATE = 1,
}

type Modes = [Mode, Mode, Mode];

export interface Instruction {
    op: OPCode;
    modes: Modes;
}

function doAdd(computer: IntCode, modes: Modes) {
    const iAddr = computer.cpuState.pc;
    const x = computer.getValue(1, modes[0]);
    const y = computer.getValue(2, modes[1]);

    return computer.setAddress(computer.getAddress(iAddr + 3), x + y).jump(4);
}

function doMultiply(computer: IntCode, modes: Modes) {
    const iAddr = computer.cpuState.pc;
    const x = computer.getValue(1, modes[0]);
    const y = computer.getValue(2, modes[1]);

    return computer.setAddress(computer.getAddress(iAddr + 3), x * y).jump(4);
}

function doInput(computer: IntCode, modes: Modes) {
    const [readInt] = computer.cpuState.stdin;
    const iAddr = computer.cpuState.pc;

    return computer.readInt().setAddress(computer.getAddress(iAddr + 1), readInt).jump(2);
}

function doOutput(computer: IntCode, modes: Modes) {
    const out = computer.getValue(1, modes[0]);

    return computer.writeInt(out).jump(2);
}

function doJumpIfTrue(computer: IntCode, modes: Modes) {
    const cond = computer.getValue(1, modes[0]);
    const jmp = computer.getValue(2, modes[1]);

    return cond !== 0 ? computer.jumpAbsolute(jmp) : computer.jump(3);
}

function doJumpIfFalse(computer: IntCode, modes: Modes) {
    const cond = computer.getValue(1, modes[0]);
    const jmp = computer.getValue(2, modes[1]);

    return cond === 0 ? computer.jumpAbsolute(jmp) : computer.jump(3);
}

function doLessThan(computer: IntCode, modes: Modes) {
    const iAddr = computer.cpuState.pc;
    const x = computer.getValue(1, modes[0]);
    const y = computer.getValue(2, modes[1]);

    return computer.setAddress(computer.getAddress(iAddr + 3), x < y ? 1 : 0).jump(4);
}

function doEquals(computer: IntCode, modes: Modes) {
    const iAddr = computer.cpuState.pc;
    const x = computer.getValue(1, modes[0]);
    const y = computer.getValue(2, modes[1]);

    return computer.setAddress(computer.getAddress(iAddr + 3), x === y ? 1 : 0).jump(4);
}

const instructionCodes: { [code in OPCode]: ((computer: IntCode, parameterModes: Modes) => IntCode) } = {
    [OPCode.ADD]: doAdd,
    [OPCode.MULT]: doMultiply,
    [OPCode.IN]: doInput,
    [OPCode.OUT]: doOutput,
    [OPCode.JUMP_TRUE]: doJumpIfTrue,
    [OPCode.JUMP_FALSE]: doJumpIfFalse,
    [OPCode.LESS_THAN]: doLessThan,
    [OPCode.EQUALS]: doEquals,

    [OPCode.NOP]: c => c.jump(1),
    [OPCode.HALT]: undefined!, // halt instruction will never be executed
};

const blankCPU = {
    pc: 0,
    stdin: [],
    stdout: []
};

export class IntCode {
    public readonly cpuState: CPU;

    constructor(
        public readonly program: number[],
        cpuState: Partial<CPU> = {},
    ) {
        this.cpuState = { ...blankCPU, ...cpuState };
    }

    getAddress(address: number) {
        return this.program[address] ?? 0;
    }

    setAddress(address: number, value: number) {
        return new IntCode(this.program.map((n, i) => i === address ? value : n), this.cpuState);
    }

    jump(offset: number) {
        return new IntCode(this.program, { ...this.cpuState, pc: this.cpuState.pc + offset });
    }

    jumpAbsolute(address: number) {
        return new IntCode(this.program, { ...this.cpuState, pc: address });
    }

    getValue(offset: number, mode: Mode) {
        return mode === Mode.IMMEDIATE ?
            this.getAddress(this.cpuState.pc + offset) :
            this.getAddress(this.getAddress(this.cpuState.pc + offset));
    }

    /**
     * Add a number to the input buffer
     */
    buffer(...inputs: number[]) {
        return new IntCode(this.program, { ...this.cpuState, stdin: [...this.cpuState.stdin, ...inputs] });
    }

    /**
     * Flush stdout
     */
    flush() {
        return new IntCode(this.program, { ...this.cpuState, stdout: [] });
    }

    /**
     * Remove the next number from the input buffer
     */
    readInt() {
        return new IntCode(this.program, { ...this.cpuState, stdin: this.cpuState.stdin.slice(1) });
    }

    /**
     * Write a number from memory to the output buffer
     */
    writeInt(out: number) {
        return new IntCode(this.program, { ...this.cpuState, stdout: [...this.cpuState.stdout, out] });
    }

    get waiting() {
        return this.currentInstruction.op === OPCode.IN && this.cpuState.stdin.length === 0;
    }

    get halted() {
        return this.currentInstruction.op === OPCode.HALT;
    }

    get currentInstruction(): Instruction {
        const inst = this.getAddress(this.cpuState.pc);
        const op = inst % 100;
        const readModes = digits(Math.floor(inst / 100)).reverse();
        const modes = readModes.concat([0, 0, 0].slice(readModes.length));
        if (!Object.values(OPCode).includes(op) || modes.some(mode => !Object.values(Mode).includes(mode))) {
            return { op: OPCode.NOP, modes: [0, 0, 0] };
        } else {
            return { op, modes: modes as Modes };
        }
    }

    step(): IntCode {
        if (this.halted || this.waiting) {
            return this;
        }
        const { op, modes } = this.currentInstruction;
        const operation = instructionCodes[op];

        return operation(this, modes);
    }

    execute(): IntCode {
        return converge((computer: IntCode) => computer.step(), this);
    }
}
