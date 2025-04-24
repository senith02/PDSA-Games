import React from 'react';

function HanoiTower({ towers, onTowerClick, selectedTower, disks, gameComplete }) {
  // Define tower colors
  const towerColors = ['#6366F1', '#8B5CF6', '#EC4899'];
  
  return (
    <div className="w-full max-w-3xl bg-gray-800 rounded-xl p-6 mb-4">
      <div className="flex justify-around items-end h-72 relative">
        {/* Base platform */}
        <div className="absolute bottom-0 w-full h-4 bg-gray-700 rounded"></div>
        
        {/* Towers */}
        {towers.map((tower, towerIndex) => (
          <div 
            key={towerIndex} 
            className={`relative flex flex-col items-center h-64 w-1/3 cursor-pointer
                      ${selectedTower === towerIndex ? 'opacity-80' : 'opacity-100'}`}
            onClick={() => onTowerClick(towerIndex)}
          >
            {/* Tower rod */}
            <div 
              className={`absolute bottom-0 w-3 h-60 rounded-t-full transition-all duration-300
                        ${towerIndex === 2 && gameComplete 
                          ? 'bg-gradient-to-t from-yellow-500 to-yellow-300 animate-pulse' 
                          : 'bg-gray-600'}`}
            ></div>
            
            {/* Tower platform */}
            <div className="absolute bottom-0 w-4/5 h-2 bg-gray-600 rounded z-10"></div>
            
            {/* Disks - stacked from bottom to top */}
            <div className="absolute bottom-2 flex flex-col-reverse w-full items-center">
              {tower.map((diskSize, diskIndex) => {
                // Calculate width based on disk size (larger number = wider disk)
                const diskWidth = 50 + (diskSize * 10);
                const hue = (diskSize * 25) % 360; // Vary hue based on disk size
                
                return (
                  <div 
                    key={diskIndex} 
                    className="disk-item relative z-20 rounded-md shadow-md mb-1 transition-all duration-300"
                    style={{
                      width: `${diskWidth}px`,
                      height: '20px',
                      backgroundColor: diskIndex === tower.length - 1 && tower === towers[selectedTower] 
                        ? '#60A5FA' // highlight top disk if tower is selected
                        : `hsl(${hue}, 80%, 60%)`,
                      transform: tower === towers[2] && gameComplete
                        ? 'scale(1.05)' // subtle pulse effect for completed tower
                        : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {diskSize}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Tower label */}
            <div className="absolute bottom-[-25px] text-white font-medium">
              {['A', 'B', 'C'][towerIndex]}
            </div>
          </div>
        ))}
      </div>
      
      {/* Interaction hint */}
      <div className="text-center mt-8 text-gray-400 text-xs">
        {selectedTower !== null 
          ? 'Click on another tower to move the disk' 
          : 'Click on a tower to select a disk'}
      </div>
    </div>
  );
}

export default HanoiTower;
