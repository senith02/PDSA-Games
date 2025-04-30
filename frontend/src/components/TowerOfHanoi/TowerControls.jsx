import React from 'react';

function TowerControls({ disks, setDisks, resetGame, isAutoSolving, navigate, towerCount, setTowerCount }) {
  const handleDiskChange = (newCount) => {
    // Ensure disk count is between 3 and 8
    if (newCount >= 3 && newCount <= 8) {
      setDisks(newCount);
    }
  };
  
  const handleTowerChange = (newCount) => {
    // Only allow 3 or 4 towers
    if (newCount === 3 || newCount === 4) {
      setTowerCount(newCount);
    }
  };
  
  return (
    <div className="w-full max-w-md flex flex-wrap justify-center gap-3 mb-4">
      <div className="flex items-center bg-gray-800 rounded-md p-1">
        <button
          onClick={() => handleDiskChange(disks - 1)}
          disabled={disks <= 3 || isAutoSolving}
          className="px-3 py-1 bg-gray-700 text-white rounded-l-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <div className="px-3 text-white font-medium">
          {disks} Disks
        </div>
        <button
          onClick={() => handleDiskChange(disks + 1)}
          disabled={disks >= 8 || isAutoSolving}
          className="px-3 py-1 bg-gray-700 text-white rounded-r-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      
      <div className="flex items-center bg-gray-800 rounded-md p-1">
        <button
          onClick={() => handleTowerChange(3)}
          disabled={towerCount === 3 || isAutoSolving}
          className={`px-3 py-1 text-white rounded-l-md ${towerCount === 3 
            ? 'bg-blue-600' 
            : 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}
        >
          3 Towers
        </button>
        <button
          onClick={() => handleTowerChange(4)}
          disabled={towerCount === 4 || isAutoSolving}
          className={`px-3 py-1 text-white rounded-r-md ${towerCount === 4 
            ? 'bg-blue-600' 
            : 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}
        >
          4 Towers
        </button>
      </div>
      
      <button
        onClick={resetGame}
        disabled={isAutoSolving}
        className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                transition-colors duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset
      </button>
      
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                transition-colors duration-200 shadow"
      >
        Back to Menu
      </button>
    </div>
  );
}

export default TowerControls;
