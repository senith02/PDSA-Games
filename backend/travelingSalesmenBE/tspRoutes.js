const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// SQLite Database Setup
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE game_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT,
      home_city TEXT,
      selected_cities TEXT,
      shortest_route TEXT,
      route_distance INTEGER,
      algorithm TEXT,
      time_taken INTEGER
    )`);
  }
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

// TSP Algorithms
const bruteForceTSP = (matrix, start, cities) => {
  const startTime = performance.now();
  const n = cities.length;
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
    throw new Error(`Start city ${start} not found in cities array`);
  }
  dp[1 << startIdx][startIdx] = 0;

  for (let mask = 0; mask < (1 << n); mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        const newMask = mask | (1 << v);
        const uIdx = cityToIndex(cities[u]);
        const vIdx = cityToIndex(cities[v]);
        const matrixValue = matrix[uIdx][vIdx];
        if (typeof matrixValue !== 'number') {
          console.error('Invalid matrix value:', { uIdx, vIdx, matrixValue });
          throw new Error('Invalid matrix value');
        }
        const newDist = dp[mask][u] + matrixValue;
        if (isNaN(newDist)) {
          console.error('newDist is NaN:', { dp: dp[mask][u], matrixValue, uIdx, vIdx });
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
  const startIdxInMatrix = cityToIndex(start);
  for (let v = 0; v < n; v++) {
    if (v === startIdx) continue;
    const vIdx = cityToIndex(cities[v]);
    const dist = dp[finalMask][v] + matrix[vIdx][startIdxInMatrix];
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
router.post('/start-game', (req, res) => {
  const { homeCity } = req.body;
  const validCities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  if (!homeCity || !validCities.includes(homeCity)) {
    return res.status(400).json({ error: 'Invalid or missing home city.' });
  }

  const matrix = generateDistanceMatrix();
  res.json({ matrix, homeCity });
});

router.post('/solve-tsp', (req, res) => {
  const { matrix, homeCity, selectedCities, playerName } = req.body;

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
  if (!matrix.every(row => row.every(val => typeof val === 'number'))) {
    return res.status(400).json({ error: 'Invalid distance matrix: all values must be numbers' });
  }

  const cityIndices = selectedCities.map(city => 'ABCDEFGHIJ'.indexOf(city));
  const citiesWithHome = [homeCity, ...selectedCities.filter(city => city !== homeCity)];

  try {
    const results = {
      bruteForce: bruteForceTSP(matrix, 'ABCDEFGHIJ'.indexOf(homeCity), cityIndices),
      nearestNeighbor: nearestNeighborTSP(matrix, 'ABCDEFGHIJ'.indexOf(homeCity), cityIndices),
      dynamicProgramming: dynamicProgrammingTSP(matrix, homeCity, citiesWithHome),
    };

    Object.entries(results).forEach(([algorithm, result]) => {
      const route = algorithm === 'dynamicProgramming'
        ? result.path.join(' -> ')
        : result.path.map(idx => 'ABCDEFGHIJ'[idx]).join(' -> ');

      db.run(
        `INSERT INTO game_records (player_name, home_city, selected_cities, shortest_route, route_distance, algorithm, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          playerName,
          homeCity,
          selectedCities.join(','),
          route,
          result.distance,
          algorithm,
          result.time,
        ],
        (err) => {
          if (err) console.error('Database insert error:', err.message);
        }
      );
    });

    res.json(results);
  } catch (error) {
    console.error('Error in /api/solve-tsp:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;