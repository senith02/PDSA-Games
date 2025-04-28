const express = require('express');
const router = express.Router();
const knightsTourController = require('../controllers/knightsTourController');
const { solveUsingBacktracking, solveUsingWarnsdorff } = require('../algorithms/knightsTour');
const KnightsTourResult = require('../models/KnightsTourResult');

// Get a solution for Knight's Tour
router.get('/solution', knightsTourController.getSolution);

// Save a player solution
router.post('/solutions', knightsTourController.saveSolution);

// Updated route to handle all game submissions (win or lose)
router.post('/submit-result', async (req, res) => {
  try {
    const { 
      playerName, 
      startRow, 
      startCol, 
      solution, 
      movesCompleted, 
      outcome, 
      algorithm, 
      timeTaken 
    } = req.body;
    
    // Validate required fields
    if (!playerName || startRow === undefined || startCol === undefined || 
        !solution || !outcome || !algorithm || !movesCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Additional validation
    if (!['win', 'lose'].includes(outcome)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Outcome must be either "win" or "lose"' 
      });
    }

    // For wins, validate the full solution
    if (outcome === 'win') {
      const isValidSolution = validateKnightsTour(solution, startRow, startCol);
      if (!isValidSolution) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid winning solution' 
        });
      }
    }
    
    // Save to database
    const newResult = new KnightsTourResult({
      playerName,
      startPosition: {
        row: startRow,
        col: startCol
      },
      solution,
      movesCompleted,
      outcome,
      algorithm,
      timeTaken: timeTaken || 0
    });
    
    await newResult.save();
    
    res.status(201).json({
      success: true,
      message: `Game result recorded successfully (${outcome})`,
      resultId: newResult._id
    });
    
  } catch (error) {
    console.error('Error saving Knight\'s Tour result:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error when saving game result', 
      error: error.message 
    });
  }
});

// Helper function to validate a knight's tour solution
function validateKnightsTour(board, startRow, startCol) {
  // Check if board is 8x8
  if (!board || !Array.isArray(board) || board.length !== 8 || 
      !board.every(row => Array.isArray(row) && row.length === 8)) {
    return false;
  }
  
  // Check starting position has move number 0
  if (board[startRow][startCol] !== 0) {
    return false;
  }
  
  // Check all numbers 0-63 are used exactly once
  const visited = new Set();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const moveNum = board[r][c];
      if (moveNum < 0 || moveNum > 63 || visited.has(moveNum)) {
        return false;
      }
      visited.add(moveNum);
    }
  }
  if (visited.size !== 64) return false;
  
  // Check each move is a valid knight's move from the previous
  for (let move = 1; move < 64; move++) {
    const prevPos = findPosition(board, move - 1);
    const currPos = findPosition(board, move);
    
    const dr = Math.abs(prevPos.r - currPos.r);
    const dc = Math.abs(prevPos.c - currPos.c);
    
    if (!((dr === 1 && dc === 2) || (dr === 2 && dc === 1))) {
      return false;
    }
  }
  
  return true;
}

// Helper to find position of a move number in the board
function findPosition(board, moveNum) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === moveNum) {
        return { r, c };
      }
    }
  }
  return null;
}

module.exports = router;