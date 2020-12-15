/* I apologize for the probably terrible C code
 * I am not a C developer, I am a javascript developer
 * but it _does_ run, and even pretty fast at that.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char** argv) {
    const int timeUpTo = 30000000;
    int input[] = { 9, 12, 1, 4, 17, 0, 18, -1 };

    // The number of steps we take represents an upper bound to the
    // numbers that we'll see, starting numbers excluded
    int* lastSeen = malloc(sizeof(int) * timeUpTo);
    memset(lastSeen, 0, timeUpTo);
    int time = 1;

    while (input[time] >= 0) {
        lastSeen[input[time - 1]] = time;
        time++;
    }
    int lastNumber = input[time - 1];

    while (time < timeUpTo) {
        if (time % 100000 == 0) {
            printf("(%.1f%%) Working on range %d - %d\n", (float)time / timeUpTo * 100, time, time + 99999);
        }
        int lastNumberSeen = lastSeen[lastNumber];
        int nextNumber = lastNumberSeen == 0 ? 0 : time - lastNumberSeen;
        lastSeen[lastNumber] = time;
        lastNumber = nextNumber;
        time++;
    }

    printf("%dth number: %d", time, lastNumber);

    free(lastSeen);
}