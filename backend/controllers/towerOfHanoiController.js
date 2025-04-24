const { solveRecursively } = require('../algorithms/towerOfHanoi/recursiveSolution');
const { solveIteratively } = require('../algorithms/towerOfHanoi/iterativeSolution');
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
      const { algorithm, disks } = req.query;
      
      // Validate parameters
      if (!algorithm || !disks) {
        return res.status(400).json({ 
          error: 'Missing required parameters (algorithm, disks)' 
        });
      }
      
      const diskCount = parseInt(disks);
      
      // Validate disk count
      if (isNaN(diskCount) || diskCount < 3 || diskCount > 10) {
        return res.status(400).json({ 
          error: 'Invalid disk count: must be between 3 and 10' 
        });
      }
      
      let result;
      
      // Call appropriate algorithm
      if (algorithm === 'recursive') {
        result = solveRecursively(diskCount);
      } else if (algorithm === 'iterative') {
        result = solveIteratively(diskCount);
      } else {
        return res.status(400).json({ 
          error: 'Invalid algorithm. Use "recursive" or "iterative"' 
        });
      }
      
      return res.json({
        algorithm,
        disks: diskCount,
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
      const { playerName, disks, moves, optimalMoves, timeTaken, algorithm } = req.body;
      
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
        algorithm
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
