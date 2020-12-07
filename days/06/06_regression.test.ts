import { openAoC } from '../../lib/input/openAoC';
import { intersect, reduction, uniq } from '../../lib/math/settools';

describe('Day 6 - Custom Customs', () => {

    test('Part 1 solves', () => {
        const answers = openAoC('./input/day6input.txt', ['\n\n', '\n', '']);

        // get the counts of unique answers in each form
        const uniqueAnswers = answers
            .map(answerForm => uniq(answerForm.flat()))
            .map(ua => ua.length);

        const sumOfCounts = uniqueAnswers.reduce((a, b) => a + b, 0);
        expect(sumOfCounts).toBe(6565);
    });

    test('Part 2 solves', () => {
        const answers = openAoC('./input/day6input.txt', ['\n\n', '\n', '']);

        // get the counts of common answers in each form
        const commonAnswers = answers
            .map(answerForm => reduction(answerForm, intersect))
            .map(ca => ca.length);

        const sumOfCommonCounts = commonAnswers.reduce((a, b) => a + b, 0);
        expect(sumOfCommonCounts).toBe(3137);
    });
});
