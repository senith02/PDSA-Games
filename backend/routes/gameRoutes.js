import express from 'express';

const router = express.Router();

// Example route for Tower of Hanoi
router.post('/towerOfHanoi', (req, res) => {
  const { playerName, numDisks, moves, timeTaken } = req.body;

  // Simulate saving data
  console.log('Received data:', { playerName, numDisks, moves, timeTaken });

  res.status(200).json({ message: 'Data received successfully!' });
});

export default router;
