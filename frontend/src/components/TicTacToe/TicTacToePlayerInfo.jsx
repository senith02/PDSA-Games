import React from 'react';

function TicTacToePlayerInfo({ playerName, setPlayerName, isHumanTurn, winner, aiAlgorithm }) {
  return (
    <div className="bg-gray-800/80 p-3 rounded-lg shadow-md mb-4">
      <h3 className="text-md font-medium text-white mb-2">Game Info</h3>
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor="playerNameTicTacToe" className="text-gray-300 text-sm">Name:</label>
        <input
          type="text"
          id="playerNameTicTacToe"
          value={playerName}
          onChange={e => {
            setPlayerName(e.target.value);
            localStorage.setItem('playerName', e.target.value); // Optionally save name
          }}
          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
          placeholder="Enter your name"
        />
      </div>
      <div className="text-sm text-gray-400">
        AI Mode: <span className="font-medium text-gray-300">{aiAlgorithm === 'minimax' ? 'Minimax' : 'Heuristic'}</span>
      </div>
      <div className="text-sm text-gray-400 mt-1">
        Status: {' '}
        {winner ? (
          <span className="font-medium text-green-400">
            {winner === '✕' ? 'You won!' : winner === '⭘' ? 'Computer won!' : 'Draw!'}
          </span>
        ) : (
          <span className={`font-medium ${isHumanTurn ? 'text-blue-400' : 'text-purple-400'}`}>
            {isHumanTurn ? 'Your turn (✕)' : 'Computer thinking...'}
          </span>
        )}
      </div>
    </div>
  );
}

export default TicTacToePlayerInfo;