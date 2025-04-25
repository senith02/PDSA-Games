const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB Database Setup
const uri = 'mongodb://localhost:27017/tsp_game'; // Update with your MongoDB URI
const client = new MongoClient(uri);

let db;

// Ensure MongoDB connection before handling requests
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('tsp_game');
    await db.collection('game_records').createIndex({ player_name: 1 });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Call connectToMongoDB and wait for it
connectToMongoDB().then(() => {
  console.log('MongoDB setup complete');
}).catch(err => {
  console.error('Failed to setup MongoDB:', err);
  process.exit(1);
});

// Helper function to generate random distances (50-100 km)
const generateDistanceMatrix = () => {
  const cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const matrix = Array(10).fill().map(() => Array(10).fill(0));
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i === j) matrix[i][j] = 0;
      else matrix[i][j] = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    }
  }
  for (let i = 0; i < 10; i++) {
    for (let j = i + 1; j < 10; j++) {
      matrix[j][i] = matrix[i][j];
    }
  }
  return matrix;
};

// Helper function to convert city letter to index
const cityToIndex = (city) => {
  const index = 'ABCDEFGHIJ'.indexOf(city);
  if (index === -1) {
    throw new Error(`Invalid city: ${city}`);
  }
  return index;
};

// Helper function to convert index to city letter
const indexToCity = (index) => {
  const cities = 'ABCDEFGHIJ';
  if (index < 0 || index >= cities.length) {
    throw new Error(`Invalid index: ${index}`);
  }
  return cities[index];
};

// TSP Algorithms
const bruteForceTSP = (matrix, start, cities) => {
  const startTime = performance.now();
  let minDistance = Infinity;
  let bestPath = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      let distance = 0;
      const path = [start, ...m, start];
      for (let i = 0; i < path.length - 1; i++) {
        distance += matrix[path[i]][path[i + 1]];
      }
      if (distance < minDistance) {
        minDistance = distance;
        bestPath = [...m];
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(cities.filter(city => city !== start));
  const endTime = performance.now();
  return { path: [start, ...bestPath, start], distance: minDistance, time: endTime - startTime };
};

const nearestNeighborTSP = (matrix, start, cities) => {
  const startTime = performance.now();
  let current = start;
  const path = [start];
  const unvisited = new Set(cities.filter(city => city !== start));
  let totalDistance = 0;

  while (unvisited.size > 0) {
    let minDist = Infinity;
    let nextCity = null;
    for (let city of unvisited) {
      if (matrix[current][city] < minDist) {
        minDist = matrix[current][city];
        nextCity = city;
      }
    }
    path.push(nextCity);
    totalDistance += minDist;
    unvisited.delete(nextCity);
    current = nextCity;
  }
  totalDistance += matrix[current][start];
  path.push(start);

  const endTime = performance.now();
  return { path, distance: totalDistance, time: endTime - startTime };
};

const dynamicProgrammingTSP = (matrix, start, cities) => {
  const startTime = performance.now();
  const n = cities.length;
  if (n < 2) {
    throw new Error('At least 2 cities are required for TSP');
  }

  const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));
  const parent = Array(1 << n).fill().map(() => Array(n).fill(-1));

  const startIdx = cities.indexOf(start);
  if (startIdx === -1) {
    throw new Error(`Start city index ${start} not found in cities array`);
  }
  dp[1 << startIdx][startIdx] = 0;

  for (let mask = 0; mask < (1 << n); mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        const newMask = mask | (1 << v);
        const newDist = dp[mask][u] + matrix[cities[u]][cities[v]];
        if (isNaN(newDist)) {
          console.error('newDist is NaN:', { dp: dp[mask][u], matrixValue: matrix[cities[u]][cities[v]], u, v });
          throw new Error('newDist is NaN');
        }
        if (newDist < dp[newMask][v]) {
          dp[newMask][v] = newDist;
          parent[newMask][v] = u;
        }
      }
    }
  }

  let minDist = Infinity;
  let lastCity = -1;
  const finalMask = (1 << n) - 1;
  for (let v = 0; v < n; v++) {
    if (v === startIdx) continue;
    const dist = dp[finalMask][v] + matrix[cities[v]][start];
    if (dist < minDist) {
      minDist = dist;
      lastCity = v;
    }
  }

  const path = [];
  let mask = finalMask;
  let current = lastCity;
  while (current !== -1) {
    path.push(cities[current]);
    const prev = parent[mask][current];
    mask = mask ^ (1 << current);
    current = prev;
  }
  path.reverse();
  path.unshift(start);
  path.push(start);

  const endTime = performance.now();
  return { path, distance: minDist, time: endTime - startTime };
};

// API Routes
router.post('/start-game', async (req, res) => {
  const { homeCity } = req.body;
  const validCities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  if (!homeCity || !validCities.includes(homeCity)) {
    return res.status(400).json({ error: 'Invalid or missing home city.' });
  }

  if (!db) {
    return res.status(500).json({ error: 'Database not connected' });
  }

  const matrix = generateDistanceMatrix();
  res.json({ matrix, homeCity });
});

router.post('/solve-tsp', async (req, res) => {
  const { matrix, homeCity, selectedCities, playerName } = req.body;

  if (!db) {
    return res.status(500).json({ error: 'Database not connected' });
  }

  if (!selectedCities || selectedCities.length < 2) {
    return res.status(400).json({ error: 'Please select at least 2 cities to visit.' });
  }

  const validCities = 'ABCDEFGHIJ'.split('');
  if (!validCities.includes(homeCity)) {
    return res.status(400).json({ error: `Invalid home city: ${homeCity}` });
  }
  if (!selectedCities.every(city => validCities.includes(city))) {
    return res.status(400).json({ error: 'Invalid selected cities' });
  }

  if (!Array.isArray(matrix) || matrix.length !== 10 || !matrix.every(row => Array.isArray(row) && row.length === 10)) {
    return res.status(400).json({ error: 'Invalid distance matrix: must be a 10x10 array' });
  }
  if (!matrix.every(row => row.every(val => typeof val === 'number' && !isNaN(val)))) {
    return res.status(400).json({ error: 'Invalid distance matrix: all values must be numbers' });
  }

  const cityIndices = selectedCities.map(city => cityToIndex(city));
  const citiesWithHomeIndices = [cityToIndex(homeCity), ...cityIndices.filter(idx => idx !== cityToIndex(homeCity))];

  try {
    const results = {
      bruteForce: bruteForceTSP(matrix, cityToIndex(homeCity), cityIndices),
      nearestNeighbor: nearestNeighborTSP(matrix, cityToIndex(homeCity), cityIndices),
      dynamicProgramming: dynamicProgrammingTSP(matrix, cityToIndex(homeCity), citiesWithHomeIndices),
    };

    const collection = db.collection('game_records');
    const insertPromises = [];

    for (const [algorithm, result] of Object.entries(results)) {
      const route = result.path.map(idx => indexToCity(idx)).join(' -> ');
      insertPromises.push(
        collection.insertOne({
          player_name: playerName || 'Anonymous',
          home_city: homeCity,
          selected_cities: selectedCities.join(','),
          shortest_route: route,
          route_distance: result.distance,
          algorithm,
          time_taken: result.time,
          created_at: new Date(),
        })
      );
    }

    await Promise.all(insertPromises).catch(err => {
      console.error('MongoDB insert error:', err.message);
      throw new Error('Failed to save game records');
    });

    res.json(results);
  } catch (error) {
    console.error('Error in /api/solve-tsp:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;