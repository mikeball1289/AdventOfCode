import { readFileSync } from 'fs';
import { intersect, reduction, uniq } from '../../lib/math/settools';

describe('Day 6 - Custom Customs', () => {
    const input = readFileSync('./input/day6input.txt', 'ascii').replace(/\r\n/g, '\n');

    const forms = input.split('\n\n').filter(f => f !== '');

    const answers = forms
        .map(testCase => testCase
            .split('\n')
            .filter(l => l !== '')
            .map(l => l.split(''))
        );

    test('Part 1 solves', () => {
        // get the counts of unique answers in each form
        const uniqueAnswers = answers
            .map(answerForm => uniq(answerForm.flat()))
            .map(ua => ua.length);

        const sumOfCounts = uniqueAnswers.reduce((a, b) => a + b, 0);
        expect(sumOfCounts).toBe(6565);
    });

    test('Part 2 solves', () => {
        // get the counts of common answers in each form
        const commonAnswers = answers
            .map(answerForm => reduction(answerForm, intersect))
            .map(ca => ca.length);

        const sumOfCommonCounts = commonAnswers.reduce((a, b) => a + b, 0);
        expect(sumOfCommonCounts).toBe(3137);
    });
});
