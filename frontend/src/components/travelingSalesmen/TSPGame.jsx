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
    if (!homeCity) {
      alert('Please select a home city.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/tsp/start-game', { homeCity });
      console.log('Start game response:', response.data);
      // Validate matrix
      const { matrix } = response.data;
      if (!Array.isArray(matrix) || matrix.length !== 10 || !matrix.every(row => Array.isArray(row) && row.length === 10)) {
        throw new Error('Received invalid distance matrix from server');
      }
      setMatrix(matrix);
      setHomeCity(response.data.homeCity);
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

  const handleHomeCitySelect = (city) => {
    setHomeCity(city);
    setSelectedCities([]);
    setResults(null);
    setMatrix(null); // Reset matrix when home city changes
  };

  const solveTSP = async () => {
    if (!playerName) {
      alert('Please enter a player name and start the game.');
      return;
    }
    if (!homeCity) {
      alert('Please select a home city and start the game.');
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

      {/* Home City Selector */}
      {!homeCity && (
        <div className="mb-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-300">Select Your Home City</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleHomeCitySelect(city)}
                className="px-4 py-2 bg-gray-700 text-gray-400 rounded-full hover:bg-gray-600 hover:text-gray-300 transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

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