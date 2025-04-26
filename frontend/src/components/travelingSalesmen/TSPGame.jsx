import React, { useState, useEffect } from 'react';
import PlayerInput from './PlayerInput';
import CitySelector from './CitySelector';
import DistanceMatrix from './DistanceMatrix';
import PathVisualization from './PathVisualization';
import ResultsDisplay from './ResultsDisplay';
import axios from 'axios';

const TSPGame = () => {
  const [matrix, setMatrix] = useState(null); // Initialize as null to distinguish from empty array
  const [homeCity, setHomeCity] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState(null);

  const cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Retrieve player name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const startGame = async () => {
    // Randomly select a home city
    const randomHomeCity = cities[Math.floor(Math.random() * cities.length)];
    setHomeCity(randomHomeCity);

    try {
      const response = await axios.post('http://localhost:5000/api/tsp/start-game', { homeCity: randomHomeCity });
      console.log('Start game response:', response.data);
      // Validate matrix
      const { matrix } = response.data;
      if (!Array.isArray(matrix) || matrix.length !== 10 || !matrix.every(row => Array.isArray(row) && row.length === 10)) {
        throw new Error('Received invalid distance matrix from server');
      }
      setMatrix(matrix);
      setSelectedCities([]);
      setResults(null);
    } catch (error) {
      console.error('Error starting game:', error.response?.data || error.message);
      alert(`Failed to start the game: ${error.response?.data?.error || error.message}. Please ensure the backend server is running on http://localhost:5000.`);
    }
  };

  const handleCityToggle = (city) => {
    if (city === homeCity) return;
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const solveTSP = async () => {
    if (!playerName) {
      alert('Please enter a player name and start the game.');
      return;
    }
    if (!homeCity) {
      alert('Please start the game to assign a home city.');
      return;
    }
    if (selectedCities.length < 2) {
      alert('Please select at least 2 cities to visit.');
      return;
    }
    if (!matrix || !Array.isArray(matrix) || matrix.length !== 10 || !matrix.every(row => Array.isArray(row) && row.length === 10)) {
      alert('Distance matrix is invalid or not loaded. Please start a new game.');
      return;
    }
    const payload = {
      matrix,
      homeCity,
      selectedCities,
      playerName,
    };
    console.log('Sending to /solve-tsp:', JSON.stringify(payload, null, 2));
    try {
      const response = await axios.post('http://localhost:5000/api/tsp/solve-tsp', payload);
      console.log('Solve TSP response:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Error solving TSP:', error.response?.data || error.message);
      alert(`Failed to solve TSP: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        Traveling Salesman Problem
      </h1>

      {/* Player Name Display (not editable) */}
      {playerName && (
        <div className="mb-4 text-gray-300">
          Playing as: <span className="font-semibold">{playerName}</span>
        </div>
      )}

      <PlayerInput
        playerName={playerName}
        setPlayerName={setPlayerName}
        startGame={startGame}
      />

      {homeCity && (
        <div className="mt-6 w-full max-w-4xl">
          <CitySelector
            cities={cities}
            homeCity={homeCity}
            selectedCities={selectedCities}
            handleCityToggle={handleCityToggle}
            solveTSP={solveTSP}
          />

          {(matrix && matrix.length > 0 || results) && (
            <div className="mt-8 flex flex-col md:flex-row gap-8">
              {matrix && matrix.length > 0 && <DistanceMatrix matrix={matrix} cities={cities} />}
              {results && <PathVisualization results={results} homeCity={homeCity} />}
            </div>
          )}
        </div>
      )}

      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default TSPGame;