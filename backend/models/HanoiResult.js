const mongoose = require('mongoose');

const HanoiResultSchema = new mongoose.Schema({
  playerName: { 
    type: String, 
    required: true 
  },
  disks: {
    type: Number,
    required: true,
    min: 3,
    max: 10
  },
  moves: {
    type: Number,
    required: true
  },
  optimalMoves: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Date,
    default: Date.now
  },
  algorithm: {
    type: String,
    enum: ['recursive', 'iterative', 'player'],
    default: 'player'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('HanoiResult', HanoiResultSchema, 'hanoi_results');
