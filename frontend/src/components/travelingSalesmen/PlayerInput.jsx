import React from 'react';

const PlayerInput = ({ playerName, setPlayerName, startGame }) => {
  return (
    <div className="mb-4 flex flex-col items-center">
      <div className="mb-4">
        <label className="text-lg font-medium mr-2 text-gray-300">Player Name:</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        onClick={startGame}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:scale-105 transition"
      >
        Start New Game
      </button>
    </div>
  );
};

export default PlayerInput;