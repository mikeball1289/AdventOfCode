import { openAoC } from '../../../lib/input/openAoC';
import { intersect, reduction, uniq } from '../../../lib/math/settools';

const answers = openAoC('./2020/input/day6input.txt', ['\n\n', '\n', '']);

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
