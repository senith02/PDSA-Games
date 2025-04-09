import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameHeader from '../components/chessboard/GameHeader';
import Chessboard from '../components/chessboard/chessboard';
import GameControls from '../components/chessboard/GameControls';
import GameInstructions from '../components/chessboard/GameInstructions';
import GameBackground from '../components/chessboard/GameBackground';

// Main component
function EightQueens() {
  const navigate = useNavigate();
  // State to track the board - each index represents a row, value is the column (-1 means no queen)
  const [board, setBoard] = useState(Array(8).fill(-1));
  // Player name state
  const [playerName, setPlayerName] = useState('Player');
  
  // Handle cell click to place/remove queens
  const handleCellClick = (row, col) => {
    setBoard(prevBoard => {
      // Create a copy of the current board
      const newBoard = [...prevBoard];
      
      // If clicking on an existing queen, remove it
      if (prevBoard[row] === col) {
        newBoard[row] = -1;
      } else {
        // Otherwise place a queen in this row at the clicked column
        newBoard[row] = col;
      }
      
      return newBoard;
    });
  };
  
  // Check if a cell has a queen
  const hasQueen = (row, col) => board[row] === col;
  
  // Check if a cell is under attack (for highlighting)
  const isUnderAttack = (row, col) => {
    // Skip if the cell has a queen (we'll highlight it differently)
    if (hasQueen(row, col)) return false;
    
    for (let i = 0; i < 8; i++) {
      // Skip rows without queens
      if (board[i] === -1) continue;
      
      // Check if in same column as any queen
      if (board[i] === col) return true;
      
      // Check if in same diagonal as any queen
      const rowDiff = Math.abs(i - row);
      const colDiff = Math.abs(board[i] - col);
      if (rowDiff === colDiff) return true;
    }
    
    return false;
  };
  
  // Check if all 8 queens are placed
  const allQueensPlaced = board.every(col => col !== -1);
  
  // Check if the current arrangement is valid (no queens attacking each other)
  const isSolutionValid = () => {
    if (!allQueensPlaced) return false;
    
    // Check each queen
    for (let row = 0; row < 8; row++) {
      const col = board[row];
      
      // Check against every other queen
      for (let otherRow = 0; otherRow < 8; otherRow++) {
        if (row === otherRow) continue; // Skip comparing a queen to itself
        
        const otherCol = board[otherRow];
        
        // Check if queens are in the same column
        if (col === otherCol) return false;
        
        // Check if queens are in the same diagonal
        const rowDiff = Math.abs(row - otherRow);
        const colDiff = Math.abs(col - otherCol);
        if (rowDiff === colDiff) return false;
      }
    }
    
    return true;
  };
  
  // Reset the board
  const resetBoard = () => {
    setBoard(Array(8).fill(-1));
  };

  // Simple player info component
  const PlayerInfo = () => (
    <div className="bg-gray-800/80 p-3 rounded-lg shadow-md mb-4">
      <h3 className="text-md font-medium text-white mb-2">Player Information</h3>
      <div className="flex items-center gap-2">
        <label htmlFor="playerName" className="text-gray-300 text-sm">Name:</label>
        <input 
          type="text" 
          id="playerName" 
          value={playerName} 
          onChange={(e) => setPlayerName(e.target.value)} 
          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
          placeholder="Enter your name"
        />
      </div>
      <div className="mt-2 text-sm text-gray-400">
        Queens placed: {board.filter(col => col !== -1).length}/8
      </div>
      {allQueensPlaced && (
        <div className={`mt-1 text-sm font-medium ${isSolutionValid() ? 'text-green-400' : 'text-red-400'}`}>
          {isSolutionValid() ? '✓ Valid solution!' : '✗ Queens are attacking each other'}
        </div>
      )}
    </div>
  );
  
  return (
    // Changed to h-screen to fit viewport exactly and constrain height
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-between overflow-auto">
      <GameBackground />
      
      {/* Main content container - takes full height with padding */}
      <div className="flex-1 flex flex-col py-4 px-4 md:px-6 max-h-full overflow-hidden">
        {/* Compact header */}
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-center
                       bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Eight Queens' Puzzle
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1 mb-3"></div>
        </div>
        
        {/* Main game area - with overflow controls */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center lg:items-start overflow-auto">
          {/* Chessboard container - will not shrink */}
          <div className="lg:flex-1 flex flex-col items-center">
            <Chessboard 
              board={board}
              handleCellClick={handleCellClick}
              hasQueen={hasQueen}
              isUnderAttack={isUnderAttack}
            />
            
            {/* Controls below board */}
            <div className="mt-3 flex gap-3 justify-center">
              <button 
                onClick={resetBoard}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                        transition-colors duration-200 shadow"
              >
                Reset Board
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                        transition-colors duration-200 shadow"
              >
                Back to Menu
              </button>
            </div>
          </div>
          
          {/* Side panel - condensed */}
          <div className="w-full lg:w-64 flex flex-col lg:max-h-full lg:overflow-auto">
            <PlayerInfo />
            
            {/* Game status and instructions */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default EightQueens;