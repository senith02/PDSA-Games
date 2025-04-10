import React from 'react';

const ResultsDisplay = ({ results }) => {
  return (
    <div className="mt-8 w-full max-w-4xl">
      <h3 className="text-2xl font-semibold mb-4 text-gray-300">Results:</h3>

      <div className="mb-6">
        <h4 className="text-xl font-medium text-blue-400">Brute Force:</h4>
        <p className="text-lg text-gray-400">
          Path: {results.bruteForce.path.map(idx => 'ABCDEFGHIJ'[idx]).join(' -> ')}
        </p>
        <p className="text-lg text-gray-400">Distance: {results.bruteForce.distance} km</p>
        <p className="text-lg text-gray-400">Time: {results.bruteForce.time.toFixed(2)} ms</p>
      </div>

      <div className="mb-6">
        <h4 className="text-xl font-medium text-blue-400">Nearest Neighbor:</h4>
        <p className="text-lg text-gray-400">
          Path: {results.nearestNeighbor.path.map(idx => 'ABCDEFGHIJ'[idx]).join(' -> ')}
        </p>
        <p className="text-lg text-gray-400">Distance: {results.nearestNeighbor.distance} km</p>
        <p className="text-lg text-gray-400">Time: {results.nearestNeighbor.time.toFixed(2)} ms</p>
      </div>

      <div>
        <h4 className="text-xl font-medium text-blue-400">Dynamic Programming:</h4>
        <p className="text-lg text-gray-400">Path: {results.dynamicProgramming.path.join(' -> ')}</p>
        <p className="text-lg text-gray-400">Distance: {results.dynamicProgramming.distance} km</p>
        <p className="text-lg text-gray-400">Time: {results.dynamicProgramming.time.toFixed(2)} ms</p>
      </div>
    </div>
  );
};

export default ResultsDisplay;