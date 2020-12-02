# Advent of Code 2020

Website: https://adventofcode.com/2020

## Goals and Principles

My goal for this year is to complete each day of the advent calendar within 48 hours of it being released. Each part of each day should exist within a file, with all shared operations existing within a library and fully unit tested.

This year I'd like to improve my process for building one-off scripts. Typically I'd write them quickly with little thought and not much effort put into proving their correctness, and that's what I've done for the Advent of Code in previous years. This time I want the code to be well-structured, sound, and - where possible - provably correct. To that end the code will be as purely functional as possible, with concessions for any highly stateful mechanisms required.

## Running the Code

After downloading the repository navigate to the root folder and run `npm i` to download the dependencies. The scripts for each day are found in the `days` folder as NodeJS scripts written in Typescript. Running `npm run build` will compile the scripts into runnable Javascript in `bin/days`.

There's a VSCode launch.json file included which will allow you to debug your currently open file in VSCode by pressing F5.

Unit testing is done in Jest. Test files end with `.test.ts` and live beside the module they're testing. `npm test` will run the unit tests.