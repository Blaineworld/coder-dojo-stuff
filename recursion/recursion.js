'use strict';

function recur(iteration = 1) {
	console.log("Iteration #" + iteration);
	recur(iteration + 1);
}

recur();