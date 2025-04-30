const TicTacToeResult = require('../models/TicTacToeResult');

/**
 * Controller for Tic-Tac-Toe endpoints
 */
const ticTacToeController = {
  /**
   * Save a game result
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  saveResult: async (req, res) => {
    try {
      const { playerName, result, aiAlgorithm, boardState, movesCount } = req.body;
      
      // Validate required fields
      if (!playerName || !result || !aiAlgorithm || !boardState) {
        return res.status(400).json({ 
          error: 'Missing required fields' 
        });
      }
      
      // Create new result document
      const newResult = new TicTacToeResult({
        playerName,
        result,
        aiAlgorithm,
        boardState,
        movesCount
      });
      
      // Save to database
      await newResult.save();
      
      res.status(201).json({ 
        message: 'Result saved successfully',
        id: newResult._id
      });
      
    } catch (error) {
      console.error('Error saving TicTacToe result:', error);
      res.status(500).json({ error: 'Error saving result' });
    }
  }
};

module.exports = ticTacToeController;