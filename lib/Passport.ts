import { inspect } from 'util';

export enum PassportFieldLabel {
    BIRTH_YEAR = 'byr',
    ISSUE_YEAR = 'iyr',
    EXPIRATION_YEAR = 'eyr',
    HEIGHT = 'hgt',
    HAIR_COLOR = 'hcl',
    EYE_COLOR = 'ecl',
    PASSPORT_ID = 'pid',
    COUNTRY_ID = 'cid',
}

export const validFieldLabels = Object.values(PassportFieldLabel);

export interface PassportField {
    label: PassportFieldLabel;
    value: string;
}

export type FieldValidator = (input: string) => boolean;
export type FieldValidators = {
    [field in PassportFieldLabel]: FieldValidator;
};

const isBetween = (earliest: number, latest: number) => (input: string) => {
    const n = parseInt(input, 10);
    return n >= earliest && n <= latest;
};

const validHeight = (input: string) => {
    if (input.endsWith('cm')) {
        return isBetween(150, 193)(input.slice(0, -2));
    } else if (input.endsWith('in')) {
        return isBetween(59, 76)(input.slice(0, -2));
    } else {
        return false;
    }
};

// Validity checks for individual fields
export const fieldValidators: FieldValidators = {
    [PassportFieldLabel.BIRTH_YEAR]: isBetween(1920, 2002),
    [PassportFieldLabel.ISSUE_YEAR]: isBetween(2010, 2020),
    [PassportFieldLabel.EXPIRATION_YEAR]: isBetween(2020, 2030),
    [PassportFieldLabel.HEIGHT]: validHeight,
    [PassportFieldLabel.HAIR_COLOR]: input => input.match(/^#[0-9a-f]{6}$/) != null,
    [PassportFieldLabel.EYE_COLOR]: input => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(input),
    [PassportFieldLabel.PASSPORT_ID]: input => input.match(/^\d{9}$/) != null,
    [PassportFieldLabel.COUNTRY_ID]: () => true,
};

export class Passport {
    constructor(public readonly fields: PassportField[]) {
        if (fields.some((field1, i) => fields.slice(i + 1).some(field2 => field1.label === field2.label))) {
            throw new Error('A passport should not contain duplicate fields');
        }
    }

    static fromText(text: string) {
        const passportFieldsText = text.split(/\s+/).filter(p => p !== '');
        const parts = passportFieldsText.map(f => f.match(/^(\w+):(.+)$/));

        function validateParts(unsanitizedParts: (RegExpMatchArray | null)[]): unsanitizedParts is [string, PassportFieldLabel, string][] {
            return !unsanitizedParts.some(p => p == null || !validFieldLabels.includes(p[1] as PassportFieldLabel));
        }

        if (!validateParts(parts)) {
            throw new Error('Failed to parse some parts');
        }

        const fields = parts.map(([, label, value]) => ({ label, value }));
        return new Passport(fields);
    }

    validate(requiredFields: PassportFieldLabel[], validateValues = true) {
        // a passport is invalid if it doesn't contains all of the required fields
        // i.e. there is a required field where this passport does not have a field with that label
        if (requiredFields.some(requiredField => !this.fields.some(field => field.label === requiredField))) {
            return false;
        }
        // a passport is invalid if any of the fields it contains have an invalid value
        // i.e. there is no field that fails to validate
        return !validateValues || !this.fields.some(field => !fieldValidators[field.label](field.value));
    }
}
