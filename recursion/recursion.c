// Does this actually work? No, really!

#include <stdio.h>
void recur(int iteration = 1) {
	printf("Iteration #%d\n", iteration);
	recur(iteration + 1);
}

int main() {
	recur();
}