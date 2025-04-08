import React from 'react'

// Component for the game header including title and player input
function GameHeader({ playerName, setPlayerName, allQueensPlaced, isSolutionValid }) {
    const handleNameChange = (e) => {
      setPlayerName(e.target.value);
    };
  
    return (
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center 
                     bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Eight Queens' Puzzle
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1 mb-4"></div>
        
        {/* Player name input */}
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="playerName" className="text-gray-300">Player:</label>
          <input 
            type="text" 
            id="playerName" 
            value={playerName} 
            onChange={handleNameChange} 
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Enter your name"
          />
        </div>
        
        {/* Game status */}
        {allQueensPlaced && (
          <div className={`text-lg font-medium ${isSolutionValid() ? 'text-green-400' : 'text-red-400'}`}>
            {isSolutionValid() ? 'Valid solution! Congratulations!' : 'Queens are attacking each other!'}
          </div>
        )}
        {!allQueensPlaced && (
          <div className="text-gray-400 text-sm">
            Place queens so that no two queens threaten each other
          </div>
        )}
      </div>
    );
  }

export default GameHeader