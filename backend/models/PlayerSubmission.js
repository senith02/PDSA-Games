// backend/models/PlayerSubmission.js
const mongoose = require('mongoose');

const PlayerSubmissionSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    answer: { type: String, required: true },
    queensPositions: { 
        type: [[Number]], 
        validate: {
            validator: function(board) {
                // Validate that the board is 8x8 with only 0s and 1s
                return board.length === 8 && 
                             board.every(row => row.length === 8 && 
                                                     row.every(cell => cell === 0 || cell === 1));
            },
            message: props => 'Queens positions must be an 8x8 board with values 0 or 1'
        }
    },
    createdAt: { type: Date, default: Date.now }
});

// The third argument sets the collection name explicitly
module.exports = mongoose.model('PlayerSubmission', PlayerSubmissionSchema, 'player_submissions');