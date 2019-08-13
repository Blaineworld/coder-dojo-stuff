# This will recur until the maximum recursion depth is reached,
# which for me is 979.

def recur(iteration):
    print("Iteration #" + str(iteration))
    recur(iteration + 1)

recur(1)
