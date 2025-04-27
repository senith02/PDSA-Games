const mongoose = require('mongoose');

const KnightsTourResultSchema = new mongoose.Schema({
  playerName: { 
    type: String, 
    required: true 
  },
  startPosition: {
    row: { 
      type: Number,
      required: true,
      min: 0,
      max: 7
    },
    col: { 
      type: Number,
      required: true,
      min: 0,
      max: 7
    }
  },
  solution: {
    type: [[Number]], // 8x8 array of move numbers (can be partial for failed attempts)
    required: true
  },
  movesCompleted: {
    type: Number,
    required: true,
    min: 1,
    max: 64
  },
  outcome: {
    type: String,
    enum: ['win', 'lose'],
    required: true
  },
  algorithm: {
    type: String,
    enum: ['backtracking', 'warnsdorff', 'player'],
    required: true
  },
  timeTaken: {
    type: Number, // in milliseconds
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('KnightsTourResult', KnightsTourResultSchema, 'knights_tour_results');