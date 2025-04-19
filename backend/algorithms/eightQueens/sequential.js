// backend/sequential.js
const { eightQueens } = require('./logic');
const { performance } = require('perf_hooks');

const n = 8;
const board = Array(n).fill(0).map(() => Array(n).fill(0));
const solutions = [];

const start = performance.now();
eightQueens(board, 0, n, solutions);
const end = performance.now();

console.log(`Eight Queens Algorithm executed in ${(end - start).toFixed(2)} milliseconds`);
console.log(`Total Solutions Found: ${solutions.length}`);
// solutions.forEach((solution, index) => {
//     console.log(`Solution ${index + 1}:`);
//     solution.forEach(row => console.log(row.join(' ')));
//     console.log("\n");
// });