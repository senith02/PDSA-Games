import express from 'express';
import { saveTowerOfHanoiResult, getAlgorithmComparison } from '../controllers/towerOfHanoiController.js';

const router = express.Router();

// Save game result
router.post('/', saveTowerOfHanoiResult);

// Get algorithm performance comparison
router.get('/algorithm-comparison', getAlgorithmComparison);

export default router;
