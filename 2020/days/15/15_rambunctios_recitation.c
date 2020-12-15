/* I apologize for the probably terrible C code
 * I am not a C developer, I am a javascript developer
 * but it _does_ run, and even pretty fast at that.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Given a list of numbers, to find the next number look at the last number in the
 * list. If that's the first time it's appeared the next number is 0, otherwise the
 * next number is how many positions ago the last time it appeared was
 */
int main(int argc, char** argv) {
    const int timeUpTo = 30000000;
    int input[] = { 9, 12, 1, 4, 17, 0, 18, -1 };

    // The number of steps we take represents an upper bound to the
    // numbers that we'll see, starting numbers excluded
    int* lastSeen = malloc(sizeof(int) * timeUpTo);
    memset(lastSeen, 0, timeUpTo);
    int time = 1;

    // Populate our last seen times with the input numbers
    while (input[time] >= 0) {
        lastSeen[input[time - 1]] = time;
        time++;
    }
    int lastNumber = input[time - 1];

    // Compute up to the position we care about
    while (time < timeUpTo) {
        if (time % 100000 == 0) {
            printf("(%.1f%%) Working on range %d - %d\n", (float)time / timeUpTo * 100, time, time + 99999);
        }
        // Check when the last time we saw the number is
        int lastNumberSeen = lastSeen[lastNumber];
        // 0 for novel numbers, otherwise the amount of time ago the number was last seen
        int nextNumber = lastNumberSeen == 0 ? 0 : time - lastNumberSeen;
        // Update the last seen index
        lastSeen[lastNumber] = time;
        // Track the last number in the list
        lastNumber = nextNumber;
        time++;
    }

    printf("%dth number: %d", time, lastNumber);

    free(lastSeen);
}