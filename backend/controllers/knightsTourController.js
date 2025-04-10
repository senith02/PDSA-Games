const { solveUsingBacktracking, solveUsingWarnsdorff } = require('../algorithms/knightsTour');

/**
 * Controller for Knight's Tour endpoints
 */
const knightsTourController = {
  /**
   * Get solution using specified algorithm
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  getSolution: (req, res) => {
    try {
      // Get parameters from request
      const { algorithm, startRow, startCol } = req.query;
      
      // Validate parameters
      if (!algorithm || startRow === undefined || startCol === undefined) {
        return res.status(400).json({ 
          error: 'Missing required parameters (algorithm, startRow, startCol)' 
        });
      }
      
      const row = parseInt(startRow);
      const col = parseInt(startCol);
      
      // Validate positions
      if (row < 0 || row > 7 || col < 0 || col > 7) {
        return res.status(400).json({ 
          error: 'Invalid position: row and col must be between 0 and 7' 
        });
      }
      
      let result;
      
      // Call appropriate algorithm
      if (algorithm === 'backtracking') {
        result = solveUsingBacktracking(row, col);
      } else if (algorithm === 'warnsdorff') {
        result = solveUsingWarnsdorff(row, col);
      } else {
        return res.status(400).json({ error: 'Invalid algorithm. Use "backtracking" or "warnsdorff"' });
      }
      
      // Return the solution with performance metrics
      return res.json({
        algorithm,
        startPosition: [row, col],
        solution: result.solution,
        executionTime: result.executionTime
      });
      
    } catch (error) {
      console.error('Error in knights tour controller:', error);
      res.status(500).json({ error: 'Server error processing knights tour' });
    }
  },
  
  /**
   * Save a player solution
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  saveSolution: (req, res) => {
    try {
      const { playerName, startPosition, solution, algorithm, moveCount } = req.body;
      
      // Here you could save to a database
      console.log(`Player ${playerName} completed Knight's Tour with ${algorithm} in ${moveCount} moves`);
      
      res.json({ success: true, message: 'Solution saved' });
    } catch (error) {
      console.error('Error saving solution:', error);
      res.status(500).json({ error: 'Error saving solution' });
    }
  }
};

module.exports = knightsTourController;