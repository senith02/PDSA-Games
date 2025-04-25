// backend/worker.js
const { workerData, parentPort } = require('worker_threads');
const { eightQueens } = require('./logic');

const { rowIndex, n } = workerData;
const board = Array(n).fill(0).map(() => Array(n).fill(0));
const solutions = [];

board[rowIndex][0] = 1;
eightQueens(board, 1, n, solutions);

parentPort.postMessage(solutions.length);
