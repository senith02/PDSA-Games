import React from 'react'
import ChessCell from './ChessCell';

// Chessboard component
function Chessboard({ board, handleCellClick, hasQueen, isUnderAttack }) {
    const colLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
    return (
      // Increased size with larger max-width
      <div className="relative bg-gray-700 p-1 md:p-3 rounded-lg shadow-xl w-full max-w-xl lg:max-w-2xl">
        {/* Chessboard with row labels */}
        <div className="flex flex-col">
          {/* Rows from 8 to 1 (top to bottom) */}
          {[...Array(8).keys()].map((row) => {
            // Convert 0-7 index to row number 1-8 (bottom to top)
            const rowNumber = 8 - row;
            // Convert visual row to data row
            const dataRow = 7 - row;
            
            return (
              <div key={row} className="flex">
                {/* Row label (8-1) */}
                <div className="w-8 flex items-center justify-center text-gray-300 text-sm font-medium">
                  {rowNumber}
                </div>
                
                {/* Chess row */}
                <div className="flex flex-1">
                  {/* Chess cells */}
                  {Array(8).fill().map((_, col) => (
                    <ChessCell
                      key={`${dataRow}-${col}`}
                      row={dataRow}
                      col={col}
                      hasQueen={hasQueen(dataRow, col)}
                      isUnderAttack={isUnderAttack(dataRow, col)}
                      onClick={() => handleCellClick(dataRow, col)}
                      colLabels={colLabels}
                      rowNumber={rowNumber}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Column labels (a-h) at the bottom */}
          <div className="flex">
            <div className="w-8 flex-shrink-0"></div> {/* Corner spacer */}
            {colLabels.map((label) => (
              <div key={label} className="flex-1 text-center text-gray-300 text-sm font-medium">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

export default Chessboard