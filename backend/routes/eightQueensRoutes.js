// backend/routes/eightQueensRoutes.js
const express = require('express');
const router = express.Router();
const { eightQueens } = require('../algorithms/eightQueens/logic');

router.get('/solutions', (req, res) => {
  const n = 8;
  const emptyBoard = Array(n).fill(0).map(() => Array(n).fill(0));
  const sols = [];
  eightQueens(emptyBoard, 0, n, sols);
  // Convert 2D board solutions to 1D array for display
  const converted = sols.map(sol => {
    const arr = Array(8).fill(-1);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (sol[r][c] === 1) arr[r] = c;
      }
    }
    return arr;
  });
  res.json({ solutions: converted });
});

module.exports = router;