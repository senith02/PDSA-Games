import React, { useState } from 'react';
import PlayerInput from './PlayerInput';
import CitySelector from './CitySelector';
import DistanceMatrix from './DistanceMatrix';
import PathVisualization from './PathVisualization';
import ResultsDisplay from './ResultsDisplay';
import axios from 'axios';

const TSPGame = () => {
  const [matrix, setMatrix] = useState([]);
  const [homeCity, setHomeCity] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState(null);

  const cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const startGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/start-game');
      setMatrix(response.data.matrix);
      setHomeCity(response.data.homeCity);
      setSelectedCities([]);
      setResults(null);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start the game. Please ensure the backend server is running on http://localhost:5000.');
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
      alert('Please enter your name.');
      return;
    }
    if (selectedCities.length < 2) {
      alert('Please select at least 2 cities to visit.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/solve-tsp', {
        matrix,
        homeCity,
        selectedCities,
        playerName,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error solving TSP:', error);
      alert('Failed to solve TSP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
        Traveling Salesman Problem
      </h1>

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

          {(matrix.length > 0 || results) && (
            <div className="mt-8 flex flex-col md:flex-row gap-8">
              {matrix.length > 0 && (
                <DistanceMatrix matrix={matrix} cities={cities} />
              )}
              {results && (
                <PathVisualization results={results} homeCity={homeCity} />
              )}
            </div>
          )}
        </div>
      )}

      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default TSPGame;