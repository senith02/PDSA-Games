import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PlayerInput from './PlayerInput';
import CitySelector from './CitySelector';
import TSPGame from './TSPGame';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import app from '../app'; // Assuming Express app is exported
import { cityToIndex, indexToCity, bruteForceTSP, nearestNeighborTSP, dynamicProgrammingTSP } from '../routes/tspRoutes';

// Axios for frontend tests
import axios from 'axios';
jest.mock('axios');

// server for mocking API calls
const server = setupServer(
  rest.post('http://localhost:5000/api/tsp/start-game', (req, res, ctx) => {
    return res(ctx.json({
      matrix: Array(10).fill().map(() => Array(10).fill(50)),
      homeCity: req.body.homeCity,
    }));
  }),
  rest.post('http://localhost:5000/api/tsp/solve-tsp', (req, res, ctx) => {
    return res(ctx.json({
      bruteForce: { path: [0, 1, 2, 0], distance: 150, time: 10 },
      nearestNeighbor: { path: [0, 1, 2, 0], distance: 150, time: 5 },
      dynamicProgramming: { path: ['A', 'B', 'C', 'A'], distance: 150, time: 8 },
    }));
  })
);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Frontend Tests
describe('Frontend Components', () => {
  test('PlayerInput renders Start New Game button', () => {
    render(<PlayerInput playerName="" setPlayerName={jest.fn()} startGame={jest.fn()} />);
    expect(screen.getByText('Start New Game')).toBeInTheDocument();
  });

  test('PlayerInput calls startGame on button click', () => {
    const startGame = jest.fn();
    render(<PlayerInput playerName="" setPlayerName={jest.fn()} startGame={startGame} />);
    fireEvent.click(screen.getByText('Start New Game'));
    expect(startGame).toHaveBeenCalled();
  });

  test('CitySelector disables home city button', () => {
    const cities = ['A', 'B', 'C'];
    render(
      <CitySelector
        cities={cities}
        homeCity="A"
        selectedCities={[]}
        handleCityToggle={jest.fn()}
        solveTSP={jest.fn()}
      />
    );
    const homeCityButton = screen.getByText('A');
    expect(homeCityButton).toBeDisabled();
  });

  test('CitySelector toggles city selection', () => {
    const handleCityToggle = jest.fn();
    const cities = ['A', 'B', 'C'];
    render(
      <CitySelector
        cities={cities}
        homeCity="A"
        selectedCities={['B']}
        handleCityToggle={handleCityToggle}
        solveTSP={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('B'));
    expect(handleCityToggle).toHaveBeenCalledWith('B');
    fireEvent.click(screen.getByText('C'));
    expect(handleCityToggle).toHaveBeenCalledWith('C');
  });

  test('TSPGame displays alert for missing player name', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<TSPGame />);
    fireEvent.click(screen.getByText('Start New Game')); // Start game to set homeCity
    await screen.findByText('Find Shortest Route'); // Wait for CitySelector to render
    fireEvent.click(screen.getByText('Find Shortest Route'));
    expect(alertSpy).toHaveBeenCalledWith('Please enter a player name and start the game.');
    alertSpy.mockRestore();
  });
});

// Backend Tests
describe('TSP Helper Functions', () => {
  const matrix = Array(10).fill().map(() => Array(10).fill(0));
  matrix[0][1] = 10; matrix[1][0] = 10;
  matrix[0][2] = 20; matrix[2][0] = 20;
  matrix[1][2] = 15; matrix[2][1] = 15;

  test('cityToIndex converts valid city to index', () => {
    expect(cityToIndex('A')).toBe(0);
    expect(cityToIndex('J')).toBe(9);
  });

  test('cityToIndex throws error for invalid city', () => {
    expect(() => cityToIndex('K')).toThrow('Invalid city: K');
  });

  test('indexToCity converts valid index to city', () => {
    expect(indexToCity(0)).toBe('A');
    expect(indexToCity(9)).toBe('J');
  });

  test('indexToCity throws error for invalid index', () => {
    expect(() => indexToCity(10)).toThrow('Invalid index: 10');
  });
});

describe('TSP Algorithms', () => {
  const matrix = [
    [0, 10, 20],
    [10, 0, 15],
    [20, 15, 0],
  ];
  const cities = [0, 1, 2]; // Indices for A, B, C
  const start = 0; // City A

  test('bruteForceTSP computes correct path and distance', () => {
    const result = bruteForceTSP(matrix, start, [1, 2]);
    expect(result.path).toEqual([0, 1, 2, 0]);
    expect(result.distance).toBe(45);
    expect(result.time).toBeGreaterThan(0);
  });

  test('nearestNeighborTSP computes valid path and distance', () => {
    const result = nearestNeighborTSP(matrix, start, [1, 2]);
    expect(result.path).toEqual([0, 1, 2, 0]);
    expect(result.distance).toBe(45);
    expect(result.time).toBeGreaterThan(0);
  });

  test('dynamicProgrammingTSP computes correct path and distance', () => {
    const result = dynamicProgrammingTSP(matrix, start, [0, 1, 2]);
    expect(result.path).toEqual([0, 1, 2, 0]);
    expect(result.distance).toBe(45);
    expect(result.time).toBeGreaterThan(0);
  });

  test('dynamicProgrammingTSP throws error for insufficient cities', () => {
    expect(() => dynamicProgrammingTSP(matrix, start, [0])).toThrow('At least 2 cities are required for TSP');
  });
});

describe('TSP API Routes', () => {
  test('POST /api/tsp/start-game returns matrix and homeCity', async () => {
    const response = await supertest(app)
      .post('/api/tsp/start-game')
      .send({ homeCity: 'A' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('matrix');
    expect(response.body.matrix).toHaveLength(10);
    expect(response.body.matrix[0]).toHaveLength(10);
    expect(response.body.homeCity).toBe('A');
  });

  test('POST /api/tsp/solve-tsp returns results for valid input', async () => {
    const matrix = Array(10).fill().map(() => Array(10).fill(50));
    for (let i = 0; i < 10; i++) matrix[i][i] = 0;
    const response = await supertest(app)
      .post('/api/tsp/solve-tsp')
      .send({
        matrix,
        homeCity: 'A',
        selectedCities: ['B', 'C'],
        playerName: 'TestPlayer',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bruteForce');
    expect(response.body.bruteForce.path).toBeDefined();
  });
});