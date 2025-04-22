const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const dotenv = require('dotenv');
const knightsTourRoutes = require('./routes/knightsTourRoutes');
const tspRoutes = require('./travelingSalesmenBE/tspRoutes');
const eightQueensRoutes = require('./routes/eightQueensRoutes');
const correctAnswerRoutes = require('./routes/QueensAnswer');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const towerOfHanoiRoutes = require('./routes/towerOfHanoiRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/knights-tour', knightsTourRoutes);
app.use('/api/tsp', tspRoutes);
app.use('/api/eightqueens', eightQueensRoutes);
app.use('/api/queen-answers', correctAnswerRoutes);
app.use('/api/users', userRoutes);
app.use('/api', gameRoutes);
app.use('/api/towerOfHanoi', towerOfHanoiRoutes);

// Default route
app.get('/', (_, res) => {
  res.json({ message: 'Algorithm Games API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
