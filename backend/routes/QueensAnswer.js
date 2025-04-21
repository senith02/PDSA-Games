const express = require('express');
const router = express.Router();
const CorrectAnswer = require('../models/PlayerSubmission');

router.post('/', async (req, res) => {
  const { playerName, answer } = req.body;
  try {
    const entry = new CorrectAnswer({ playerName, answer });
    await entry.save();
    res.status(201).json({ message: 'Saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save.' });
  }
});

module.exports = router;