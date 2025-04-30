const { solveRecursively } = require('../algorithms/towerOfHanoi/recursiveSolution');
const { solveIteratively } = require('../algorithms/towerOfHanoi/iterativeSolution');
const { solveFourTowerRecursively } = require('../algorithms/towerOfHanoi/fourTowerRecursiveSolution');
const { solveFourTowerIteratively } = require('../algorithms/towerOfHanoi/fourTowerIterativeSolution');
const HanoiResult = require('../models/HanoiResult');

/**
 * Controller for Tower of Hanoi endpoints
 */
const towerOfHanoiController = {
  /**
   * Get solution using specified algorithm
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  getSolution: (req, res) => {
    try {
      // Get parameters from request
      const { algorithm, disks, towers = "3" } = req.query;
      
      // Validate parameters
      if (!algorithm || !disks) {
        return res.status(400).json({ 
          error: 'Missing required parameters (algorithm, disks)' 
        });
      }
      
      const diskCount = parseInt(disks);
      const towerCount = parseInt(towers);
      
      // Validate disk count
      if (isNaN(diskCount) || diskCount < 3 || diskCount > 10) {
        return res.status(400).json({ 
          error: 'Invalid disk count: must be between 3 and 10' 
        });
      }
      
      // Validate tower count
      if (isNaN(towerCount) || ![3, 4].includes(towerCount)) {
        return res.status(400).json({
          error: 'Invalid tower count: must be either 3 or 4'
        });
      }
      
      let result;
      
      // Call appropriate algorithm based on tower count and algorithm choice
      if (towerCount === 3) {
        if (algorithm === 'recursive') {
          result = solveRecursively(diskCount);
        } else if (algorithm === 'iterative') {
          result = solveIteratively(diskCount);
        } else {
          return res.status(400).json({ 
            error: 'Invalid algorithm. Use "recursive" or "iterative"' 
          });
        }
      } else { // towerCount === 4
        if (algorithm === 'recursive') {
          result = solveFourTowerRecursively(diskCount);
        } else if (algorithm === 'iterative') {
          result = solveFourTowerIteratively(diskCount);
        } else {
          return res.status(400).json({ 
            error: 'Invalid algorithm. Use "recursive" or "iterative"' 
          });
        }
      }
      
      return res.json({
        algorithm,
        disks: diskCount,
        towerCount,
        moves: result.moves,
        executionTime: result.executionTime,
        steps: result.steps
      });
      
    } catch (error) {
      console.error('Error in Tower of Hanoi controller:', error);
      res.status(500).json({ error: 'Server error processing Tower of Hanoi' });
    }
  },
  
  /**
   * Save a game result
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  saveResult: async (req, res) => {
    try {
      const { playerName, disks, moves, optimalMoves, timeTaken, algorithm, towerCount = 3 } = req.body;
      
      // Validate required fields
      if (!playerName || !disks || moves === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields (playerName, disks, moves)' 
        });
      }
      
      // Create new result document
      const result = new HanoiResult({
        playerName,
        disks,
        moves,
        optimalMoves,
        timeTaken,
        algorithm,
        towerCount
      });
      
      // Save to database
      await result.save();
      
      res.status(201).json({ 
        message: 'Result saved successfully',
        id: result._id
      });
      
    } catch (error) {
      console.error('Error saving Tower of Hanoi result:', error);
      res.status(500).json({ error: 'Error saving result' });
    }
  }
};

module.exports = towerOfHanoiController;
