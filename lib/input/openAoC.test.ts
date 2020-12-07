import * as fs from 'fs';
import { openAoC } from './openAoC';

jest.mock('fs');

const readFileSyncMock: jest.Mock<string> = (fs as any).readFileSync;
readFileSyncMock.mockReturnValue('1,2,3\r\n4,5,6\n');

describe('openAoC', () => {
    it('should open the input text and normalize line endings', () => {
        const result = openAoC('test');

        expect(result).toBe('1,2,3\n4,5,6\n');
    });

    it('should split the input on the given character and drop blank inputs', () => {
        const result = openAoC('test', ['\n']);

        expect(result).toStrictEqual(['1,2,3', '4,5,6']);
    });

    it('should split multidimensional data hierarchically on the list of tokens', () => {
        const result = openAoC('test', ['\n', ',']);

        expect(result).toStrictEqual([['1', '2', '3'], ['4', '5', '6']]);
    });

    it('should accept regexp as a split token', () => {
        const result = openAoC('test', ['\n', /[25],/]);

        expect(result).toStrictEqual([['1,', '3'], ['4,', '6']]);
    });
});
