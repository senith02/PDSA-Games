import React from 'react'

// Instructions component
function GameInstructions() {
    return (
      <div className="mt-6 text-gray-400 text-sm max-w-md text-center">
        <p>Click on a square to place or remove a queen.</p>
        <p className="mt-1">The goal is to place 8 queens on the board so that no two queens threaten each other.</p>
        <p className="mt-1">Red squares show threatened positions.</p>
      </div>
    );
  }

export default GameInstructions