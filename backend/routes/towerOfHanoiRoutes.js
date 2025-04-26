const express = require('express');
const router = express.Router();
const towerOfHanoiController = require('../controllers/towerOfHanoiController');

// Get solution for Tower of Hanoi
router.get('/solution', towerOfHanoiController.getSolution);

// Save game results
router.post('/results', towerOfHanoiController.saveResult);

module.exports = router;
