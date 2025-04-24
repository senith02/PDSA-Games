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
        console.log(`Recursive solution generated with ${result.moves.length} moves`);
      } else if (algorithm === 'iterative') {
        result = solveIteratively(diskCount);
        console.log(`Iterative solution generated with ${result.moves.length} moves`);
      } else {
        return res.status(400).json({ 
          error: 'Invalid algorithm. Use "recursive" or "iterative"' 
        });
      }
      
      // Validate the result format
      if (!result || !Array.isArray(result.moves) || result.moves.length === 0) {
        throw new Error(`Algorithm returned invalid result format: ${JSON.stringify(result)}`);
      }
      
      // Log a sample of the moves for debugging
      console.log("Sample moves:", result.moves.slice(0, 5));

      // Ensure every move has the correct format [from, to]
      const validatedMoves = result.moves.map((move, index) => {
        if (!Array.isArray(move) || move.length !== 2 || 
            typeof move[0] !== 'number' || typeof move[1] !== 'number' ||
            move[0] < 0 || move[0] > 2 || move[1] < 0 || move[1] > 2) {
          console.error(`Invalid move format at index ${index}: ${JSON.stringify(move)}`);
          throw new Error(`Invalid move format in algorithm result at index ${index}`);
        }
        return move;
      });
      
      const response = {
        algorithm,
        disks: diskCount,
        moves: validatedMoves,
        executionTime: result.executionTime,
        steps: result.steps
      };

      console.log(`Sending Tower of Hanoi solution with ${validatedMoves.length} moves`);
      return res.json(response);
      
    } catch (error) {
      console.error('Error in Tower of Hanoi controller:', error);
      res.status(500).json({ error: `Server error: ${error.message}` });
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
