const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the database connection

require('dotenv').config();

const knightsTourRoutes = require('./routes/knightsTourRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests

// MongoDB Connection
connectDB(); // Call the function to connect to MongoDB

// API routes
app.use('/api/knights-tour', knightsTourRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Algorithm Games API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});