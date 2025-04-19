import mongoose from 'mongoose';

const TowerOfHanoiResultSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  numDisks: { type: Number, required: true },
  moves: { type: [String], required: true },
  timeTaken: { type: Number, required: true },
});

export default mongoose.model('TowerOfHanoiResult', TowerOfHanoiResultSchema);
