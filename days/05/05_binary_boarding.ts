import { readFileSync } from 'fs';
import { parseBoardingPass } from '../../lib/boarding-passes';

const input = readFileSync('./input/day5input.txt', 'ascii').replace(/\r\n/g, '\n');
const passTexts = input.split('\n').filter(l => l !== '');
const boardingPasses = passTexts.map(t => parseBoardingPass(t));

const seats = boardingPasses.map(pass => pass.seat);
const maxSeat = Math.max(...seats);

console.log(maxSeat); // 965

const sortedSeats = seats.slice().sort((a, b) => a - b);
const singleSeatHoles = sortedSeats
    // chop the last seat so we don't run over the end when checking
    .slice(0, -1)
    // since the list is sorted, a single-seat hole will
    // exist when the next seat is 2 higher than the last one
    .filter((seat, i) => sortedSeats[i + 1] === seat + 2)
    // so the missing seats are the ones 1 higher than the ones we found
    .map(seat => seat + 1);

console.log(singleSeatHoles); // [524]
