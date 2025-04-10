const express = require('express');
const router = express.Router();
const knightsTourController = require('../controllers/knightsTourController');

// Get a solution for Knight's Tour
router.get('/solution', knightsTourController.getSolution);

// Save a player solution
router.post('/solutions', knightsTourController.saveSolution);

module.exports = router;