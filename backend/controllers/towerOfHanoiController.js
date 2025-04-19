import TowerOfHanoiResult from '../models/TowerOfHanoiResult.js';

export const saveTowerOfHanoiResult = async (req, res) => {
  try {
    const { playerName, numDisks, moves, timeTaken } = req.body;
    const result = new TowerOfHanoiResult({ playerName, numDisks, moves, timeTaken });
    await result.save();
    res.status(201).json({ message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
