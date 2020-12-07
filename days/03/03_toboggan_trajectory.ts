import { readFileSync } from 'fs';
import { openAoC } from '../../lib/input/openAoC';
import { Point } from '../../lib/math/Point';
import { TreeField } from '../../lib/trees';

const input = openAoC('./input/day3input.txt');

const field = TreeField.fromText(input);
const collisions = field.collisions(new Point(3, 1));

console.log(collisions); // 156

const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].map(([x, y]) => new Point(x, y));

// Find the product of the number of collisions for each of the given slopes
const result = slopes.map(slope => field.collisions(slope)).reduce((prev, curr) => prev * curr, 1);
console.log(result); // 3521829480
