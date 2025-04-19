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

// Start server - ensure this is the last action in the file
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Remove or comment out any testing code that might be interfering with server start
// The Knight's Tour algorithm tests will now only run when endpoints are called