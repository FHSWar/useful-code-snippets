// Small program to test the maximum amount of allocations in multiple blocks.
// This script searches for the largest allocation amount.

// Allocate a certain size to test if it can be done.
function alloc(size) {
	const numbers = size / 8;
	const arr = [];
	arr.length = numbers; // Simulate allocation of 'size' bytes.
	for (let i = 0; i < numbers; i++) {
		arr[i] = i;
	}
	return arr;
}

// Keep allocations referenced so they aren't garbage collected.
const allocations = [];

// Allocate successively larger sizes, doubling each time until we hit the limit.
function allocToMax() {
	console.log('Start');

	const field = 'heapUsed';
	const mu = process.memoryUsage();

	console.log(mu);

	const gbStart = mu[field] / 1024 / 1024 / 1024;

	console.log(`Start ${Math.round(gbStart * 100) / 100} GB`);

	const allocationStep = 100 * 1024;

	// Infinite loop
	while (true) {
		// Allocate memory.
		const allocation = alloc(allocationStep);
		// Allocate and keep a reference so the allocated memory isn't garbage collected.
		allocations.push(allocation);
		// Check how much memory is now allocated.
		const mu = process.memoryUsage();
		const gbNow = mu[field] / 1024 / 1024 / 1024;

		console.log(`Allocated since start ${Math.round((gbNow - gbStart) * 100) / 100} GB`);
	}

	// Infinite loop, never get here.
}

allocToMax();
