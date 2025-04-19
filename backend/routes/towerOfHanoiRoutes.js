import express from 'express';
import { saveTowerOfHanoiResult } from '../controllers/towerOfHanoiController.js';

const router = express.Router();

router.post('/', saveTowerOfHanoiResult);

export default router;
