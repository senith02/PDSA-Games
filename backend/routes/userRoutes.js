import express from 'express';

const router = express.Router();

// Example route for user-related operations
router.get('/', (req, res) => {
  res.send('User routes are working!');
});

export default router;
