import React from 'react';

function TicTacToeInstructions() {
  return (
    <div className="bg-gray-800/80 p-3 rounded-lg shadow-md">
      <h3 className="text-md font-medium text-white mb-2">How to Play</h3>
      <div className="text-gray-400 text-xs space-y-1">
        <p>Players take turns placing their mark ('✕' or '⭘') on an empty square.</p>
        <p>The first player to get 5 of their marks in a row (horizontally, vertically, or diagonally) wins.</p>
        <p>If all squares are filled and no player has won, the game is a draw.</p>
        <p className="mt-2">Select the AI difficulty (Heuristic or Minimax) before starting.</p>
      </div>
    </div>
  );
}

export default TicTacToeInstructions;