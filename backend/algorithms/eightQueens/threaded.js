// backend/threaded.js
const { Worker } = require('worker_threads');
const { performance } = require('perf_hooks');

const n = 8;
let totalSolutions = 0;
let completed = 0;
const startTime = performance.now();

for (let row = 0; row < n; row++) {
    const worker = new Worker('./worker.js', {
        workerData: { rowIndex: row, n: n }
    });

    worker.on('message', (solutionsCount) => {
        totalSolutions += solutionsCount;
        completed++;
        if (completed === n) {
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            console.log(`Threaded Eight Queens Algorithm executed in ${duration} milliseconds`);
            console.log(`Total Solutions Found: ${totalSolutions}`);
        }
    });

    worker.on('error', (err) => console.error("Worker error:", err));
    worker.on('exit', (code) => {
        if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });
}
