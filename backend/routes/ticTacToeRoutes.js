const express = require('express');
const router = express.Router();
const ticTacToeController = require('../controllers/ticTacToeController');

// POST route to save Tic-Tac-Toe game results
router.post('/results', ticTacToeController.saveResult);

module.exports = router;