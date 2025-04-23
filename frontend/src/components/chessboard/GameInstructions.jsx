import React from 'react'

// Instructions component
function GameInstructions() {
  return (
    <div className="bg-gray-800/80 p-3 rounded-lg shadow-md">
    <h3 className="text-md font-medium text-white mb-2">Instructions</h3>
    <div className="text-gray-400 text-xs">
      <p>Click on a square to place or remove a queen.</p>
      <p className="mt-1">The goal is to place 8 queens on the board so that no two queens threaten each other.</p>
      <p className="mt-1">Red squares show threatened positions.</p>
      
      <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
      <p className="font-medium text-gray-300">Tip: A valid solution requires that no two queens:</p>
      <ul className="list-disc pl-4 mt-1 space-y-0.5">
        <li>Share the same row</li>
        <li>Share the same column</li>
        <li>Share the same diagonal</li>
      </ul>
      </div>
    </div>
    </div>
  );
  }

export default GameInstructions