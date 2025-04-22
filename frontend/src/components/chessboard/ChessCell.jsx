import React from 'react'

// Chess cell component
function ChessCell({ row, col, hasQueen, isUnderAttack, onClick, colLabels, rowNumber }) {
    // Determine cell color based on position and state
    const getCellClasses = () => {
      const isDarkSquare = (row + col) % 2 === 0;
      const baseClasses = "w-full h-full flex items-center justify-center transition-all duration-200";
      
      // Base cell color (alternating pattern)
      let cellClasses = isDarkSquare 
        ? "bg-gray-800 hover:bg-gray-700" 
        : "bg-gray-600 hover:bg-gray-500";
      
      // Add queen highlighting
      if (hasQueen) {
        cellClasses = "bg-purple-700 hover:bg-purple-600";
      } 
      // Add attacked cell highlighting
      else if (isUnderAttack) {
        cellClasses = isDarkSquare 
          ? "bg-red-900/80 hover:bg-red-800" 
          : "bg-red-800/60 hover:bg-red-700";
      }
      
      return `${baseClasses} ${cellClasses}`;
    };
  
    return (
      <button 
        className={`aspect-square flex-1 ${getCellClasses()}`}
        onClick={onClick}
        aria-label={`Cell ${colLabels[col]}${rowNumber}`}
      >
        {hasQueen && (
          <span className="text-white text-2xl md:text-3xl">♕</span>
        )}
      </button>
    );
  }

export default ChessCell