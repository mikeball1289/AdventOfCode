export interface PasswordRequirement {
    char: string;
    min: number;
    max: number;
}

export interface PasswordLine {
    requirement: PasswordRequirement;
    password: string;
}

export function parseLine(line: string): PasswordLine {
    const passwordLineMatcher = /^(\d+)-(\d+) (\w): (\w+)$/;
    const match = line.match(passwordLineMatcher);
    if (!match) {
        throw new Error(`"${line}" Each line must consist of exactly one requirement and one password`);
    }

    const [, min, max, char, password] = match;

    return {
        requirement: {
            min: parseInt(min, 10),
            max: parseInt(max, 10),
            char,
        },
        password,
    };
}

export function passwordSatisfiesRequirement(password: string, requirement: PasswordRequirement) {
    // the required character must appear between min and max times (inclusive) in the password string
    const repetitions = password.split(requirement.char).length - 1;
    return repetitions >= requirement.min && repetitions <= requirement.max;
}

export function passwordSatisfiesTobogganRequirement(password: string, requirement: PasswordRequirement) {
    // the required character must exist at one of the min position and max position, 1-indexed, but not at both
    return (password.charAt(requirement.min - 1) === requirement.char) !== (password.charAt(requirement.max - 1) === requirement.char);
}
