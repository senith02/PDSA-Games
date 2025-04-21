// backend/models/PlayerSubmission.js
const mongoose = require('mongoose');

const PlayerSubmissionSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    answer: { type: String, required: true },
    gameName: { type: String, required: true }, // Add this line
    createdAt: { type: Date, default: Date.now }
});

PlayerSubmissionSchema.index({ answer: 1, gameName: 1 }, { unique: true }); // Make answer unique per game
module.exports = mongoose.model('PlayerSubmission', PlayerSubmissionSchema, 'player_submissions');