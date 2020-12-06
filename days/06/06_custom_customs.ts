import { readFileSync } from 'fs';
import { intersect, reduction, uniq } from '../../lib/math/settools';

const input = readFileSync('./input/day6input.txt', 'ascii').replace(/\r\n/g, '\n');

const forms = input.split('\n\n').filter(f => f !== '');

const answers = forms
    .map(testCase => testCase
        .split('\n')
        .filter(l => l !== '')
        .map(l => l.split(''))
    );

// get the counts of unique answers in each form
const uniqueAnswers = answers
    .map(answerForm => uniq(answerForm.flat()))
    .map(ua => ua.length);

const sumOfUniqueCounts = uniqueAnswers.reduce((a, b) => a + b, 0);
console.log(sumOfUniqueCounts); // 6565

// get the counts of common answers in each form
const commonAnswers = answers
    .map(answerForm => reduction(answerForm, intersect))
    .map(ca => ca.length);

const sumOfCommonCounts = commonAnswers.reduce((a, b) => a + b, 0);
console.log(sumOfCommonCounts); // 3137
