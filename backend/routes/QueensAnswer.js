const express = require('express');
const router = express.Router();
const PlayerSubmission = require('../models/PlayerSubmission');

// Get total number of unique solutions for Eight Queens
const TOTAL_EIGHT_QUEENS_SOLUTIONS = 92;

router.post('/', async (req, res) => {
  // Destructure gameName from the request body
  const { playerName, answer, gameName } = req.body; 

  if (!gameName) {
    return res.status(400).json({ error: 'Game name is required.' });
  }

  try {
    // Check if all solutions for this specific game have been found
    // (Only reset if it's the Eight Queens game reaching its limit)
    if (gameName === 'Eight Queens') {
        const count = await PlayerSubmission.countDocuments({ gameName: 'Eight Queens' });
        if (count >= TOTAL_EIGHT_QUEENS_SOLUTIONS) {
            // Clear only Eight Queens submissions
            await PlayerSubmission.deleteMany({ gameName: 'Eight Queens' });
        }
    }

    // Check if this answer already exists for this game
    const exists = await PlayerSubmission.findOne({ answer, gameName });
    if (exists) {
      return res.status(409).json({ message: `This solution for ${gameName} has already been recognized. Try another!` });
    }

    // Save new correct answer with gameName
    const entry = new PlayerSubmission({ playerName, answer, gameName }); 
    await entry.save();
    res.status(201).json({ message: `Correct! Your ${gameName} solution has been recorded.` });
  } catch (err) {
    // Handle potential duplicate key error more gracefully
    if (err.code === 11000) {
         return res.status(409).json({ message: `This solution for ${gameName} has already been recognized (duplicate key). Try another!` });
    }
    console.error("Error saving submission:", err); // Log the actual error
    res.status(500).json({ error: 'Failed to save submission.' });
  }
});

module.exports = router;