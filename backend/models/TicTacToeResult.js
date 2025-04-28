const mongoose = require('mongoose');

const TicTacToeResultSchema = new mongoose.Schema({
  playerName: { 
    type: String, 
    required: true 
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'draw'],
    required: true
  },
  aiAlgorithm: {
    type: String,
    enum: ['heuristic', 'minimax'],
    required: true
  },
  boardState: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  movesCount: {
    type: Number,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('TicTacToeResult', TicTacToeResultSchema, 'tic_tac_toe_results');