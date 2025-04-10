const express = require('express');
const cors = require('cors');
const knightsTourRoutes = require('./routes/knightsTourRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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