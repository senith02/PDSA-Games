import React from 'react'

// Controls component
function GameControls({ resetBoard, navigate }) {
    return (
      <div className="mt-4 flex gap-3">
        <button 
          onClick={resetBoard}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md 
                   transition-colors duration-200 shadow"
        >
          Reset Board
        </button>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md 
                   transition-colors duration-200 shadow"
        >
          Back to Menu
        </button>
      </div>
    );
  }

export default GameControls