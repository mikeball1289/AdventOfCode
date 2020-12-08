import { converge } from '../../lib/math/funcs';

export interface CPU {
    pc: number;
}

export enum OPCode {
    ADD = 1,
    MULT = 2,

    HALT = 99,
}

function doAdd(computer: IntCode) {
    const iAddr = computer.cpuState.pc;
    const x = computer.getAddress(computer.getAddress(iAddr + 1));
    const y = computer.getAddress(computer.getAddress(iAddr + 2));
    return computer.setAddress(computer.getAddress(iAddr + 3), x + y).jump(4);
}

function doMultiply(computer: IntCode) {
    const iAddr = computer.cpuState.pc;
    const x = computer.getAddress(computer.getAddress(iAddr + 1));
    const y = computer.getAddress(computer.getAddress(iAddr + 2));
    return computer.setAddress(computer.getAddress(iAddr + 3), x * y).jump(4);
}

const instructionCodes: { [code: number]: ((computer: IntCode) => IntCode) | undefined } = {
    [OPCode.ADD]: doAdd,
    [OPCode.MULT]: doMultiply,
};

export class IntCode {
    constructor(
        public readonly program: number[],
        public readonly cpuState: CPU = { pc: 0 },
    ) { }

    getAddress(address: number) {
        return this.program[address] ?? 0;
    }

    setAddress(address: number, value: number) {
        return new IntCode(this.program.map((n, i) => i === address ? value : n), this.cpuState);
    }

    jump(offset: number) {
        return new IntCode(this.program, { ...this.cpuState, pc: this.cpuState.pc + offset });
    }

    get halted() {
        return this.getAddress(this.cpuState.pc) === OPCode.HALT;
    }

    step(): IntCode {
        if (this.halted) {
            return this;
        }
        const instruction = this.getAddress(this.cpuState.pc);
        const operation = instructionCodes[instruction];
        if (operation === undefined) {
            return this;
        }

        return operation(this);
    }

    execute(): IntCode {
        return converge((computer: IntCode) => computer.step(), this);
    }
}
