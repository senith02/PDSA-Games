const request = require('supertest');
const app = require('./server');

describe('Traveling Salesman Problem API', () => {
  test('POST /api/start-game should return a distance matrix and home city', async () => {
    const response = await request(app).post('/api/start-game');
    expect(response.status).toBe(200);
    expect(response.body.matrix).toHaveLength(10);
    expect(response.body.matrix[0]).toHaveLength(10);
    expect(response.body.homeCity).toBeDefined();
  });

  test('POST /api/solve-tsp should return results for all algorithms', async () => {
    const startResponse = await request(app).post('/api/start-game');
    const { matrix, homeCity } = startResponse.body;

    const response = await request(app)
      .post('/api/solve-tsp')
      .send({
        matrix,
        homeCity,
        selectedCities: ['A', 'B', 'C'],
        playerName: 'TestPlayer',
      });

    expect(response.status).toBe(200);
    expect(response.body.bruteForce).toHaveProperty('path');
    expect(response.body.bruteForce).toHaveProperty('distance');
    expect(response.body.bruteForce).toHaveProperty('time');
    expect(response.body.nearestNeighbor).toHaveProperty('path');
    expect(response.body.dynamicProgramming).toHaveProperty('path');
  });

  test('POST /api/solve-tsp should return 400 if fewer than 2 cities are selected', async () => {
    const startResponse = await request(app).post('/api/start-game');
    const { matrix, homeCity } = startResponse.body;

    const response = await request(app)
      .post('/api/solve-tsp')
      .send({
        matrix,
        homeCity,
        selectedCities: ['A'],
        playerName: 'TestPlayer',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Please select at least 2 cities to visit.');
  });
});