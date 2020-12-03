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
    const parts = line.split(': ');
    if (parts.length !== 2) throw new Error(`"${line}" Each line must consist of exactly one requirement and one password`);
    const [req, password] = parts;
    const reqParts = req.split(/[ \-]/);
    if (reqParts.length !== 3) throw new Error(`"${line}" A requirement must contain a min, max, and character`);
    return {
        requirement: {
            min: parseInt(reqParts[0]),
            max: parseInt(reqParts[1]),
            char: reqParts[2],
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