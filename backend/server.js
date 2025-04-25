const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const knightsTourRoutes = require('./routes/knightsTourRoutes');
const tspRoutes = require('./travelingSalesmenBE/tspRoutes');
const eightQueensRoutes = require('./routes/eightQueensRoutes');
const correctAnswerRoutes = require('./routes/QueensAnswer');
const towerOfHanoiRoutes = require('./routes/towerOfHanoiRoutes'); // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests

// API routes
app.use('/api/knights-tour', knightsTourRoutes);
app.use('/api/tsp', tspRoutes);
app.use('/api/eightqueens', eightQueensRoutes);
app.use('/api/queen-answers', correctAnswerRoutes);
app.use('/api/tower-of-hanoi', towerOfHanoiRoutes); // Add this line

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Algorithm Games API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});