import React from 'react';

function HanoiPlayerInfo({ playerName, setPlayerName, moves, minMoves, gameComplete }) {
  return (
    <div className="bg-gray-800/80 p-3 rounded-lg shadow-md mb-4">
      <h3 className="text-md font-medium text-white mb-2">Player Information</h3>
      <div className="flex items-center gap-2">
        <label htmlFor="playerName" className="text-gray-300 text-sm">Name:</label>
        <input 
          type="text" 
          id="playerName" 
          value={playerName} 
          onChange={e => {
            setPlayerName(e.target.value);
            localStorage.setItem('playerName', e.target.value);
          }}
          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
          placeholder="Enter your name"
        />
      </div>
      <div className="mt-2 text-sm">
        <div className="text-gray-400">
          Moves: <span className="text-white">{moves}</span> / Optimal: <span className="text-white">{minMoves}</span>
        </div>
        <div className="mt-1">
          {gameComplete && (
            <div className={`font-medium ${moves <= minMoves ? 'text-green-400' : 'text-blue-400'}`}>
              {moves <= minMoves 
                ? '✨ Perfect! Solved in minimum moves!' 
                : `Completed! ${moves - minMoves} moves over optimal.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HanoiPlayerInfo;
