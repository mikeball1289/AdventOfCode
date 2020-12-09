import { openAoC } from '../../../lib/input/openAoC';
import { isSome, maybeDo } from '../../../lib/funcs';
import { cross } from '../../../lib/math/settools';
import { distanceAlongPath, parseWiresFromPath } from '../../lib/Wire';

const wirePaths = openAoC('./2019/input/day3input.txt', ['\n', ',']);
const path1 = parseWiresFromPath(wirePaths[0]);
const path2 = parseWiresFromPath(wirePaths[1]);

const intersectionDistances = cross(path1, path2)
    // get each pair of wires in each path
    .map(([wire1, wire2]) => wire1.intersection(wire2))
    // filter out the ones that didn't intersect
    .filter(isSome)
    // filter out the one at the beginning where both wires started
    .filter(p => !p.isOrigin())
    // get the manhattan distance of each intersection
    .map(p => Math.abs(p.x) + Math.abs(p.y));

console.log(Math.min(...intersectionDistances)); // 865

const intersectionDistanceAlongPath = cross(path1, path2)
    // get each pair of wires in each path
    .map(([wire1, wire2]) => wire1.intersection(wire2))
    // filter out the ones that didn't intersect
    .filter(isSome)
    // filter out the one at the beginning where both wires started
    .filter(p => !p.isOrigin())
    // get the manhattan distance of each intersection
    .map(p => maybeDo((x, y) => x + y, distanceAlongPath(path1, p), distanceAlongPath(path2, p)))
    .filter(isSome);

console.log(Math.min(...intersectionDistanceAlongPath)); // 35038
