import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chessboard from '../components/chessboard/chessboard';
import GameBackground from '../components/chessboard/GameBackground';

function KnightsTour() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('Player');
  
  // Board state: -1 = empty, 0 = knight's starting position, 1+ = move sequence
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(-1)));
  
  // Current position of the knight
  const [currentPosition, setCurrentPosition] = useState(null);
  
  // Current move number (starts at 1 after initial placement)
  const [moveNumber, setMoveNumber] = useState(0);
  
  // Game status: 'setup', 'playing', 'won', 'lost'
  const [gameStatus, setGameStatus] = useState('setup');
  
  // Get player name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);
  
  // Possible knight moves (8 possible L-shaped moves)
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  const [algorithmType, setAlgorithmType] = useState('player'); // 'player', 'backtracking', or 'warnsdorff'
  const [solutionPath, setSolutionPath] = useState(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Add a function to call the backend API for solutions
  const fetchAlgorithmSolution = async (algorithm) => {
    if (!currentPosition) return;
    
    try {
      // Show loading state (optional)
      setShowingSolution(true);
      setAlgorithmType(algorithm);
      setSolutionPath(null); // Clear previous solution
      
      // Get starting position
      const [startRow, startCol] = currentPosition;
      
      // Call the API
      const response = await axios.get('http://localhost:5000/api/knights-tour/solution', {
        params: {
          algorithm,
          startRow,
          startCol
        }
      });
      
      // Update the state with the solution
      setSolutionPath(response.data.solution);
      
      // Optionally display the execution time
      console.log(`${algorithm} solution found in ${response.data.executionTime.toFixed(2)} ms`);
      
    } catch (error) {
      console.error('Error fetching solution:', error);
      // Reset state or show error message
      setShowingSolution(false);
    }
  };
  
  // Update the showAlgorithmicSolution function to use the API
  const showAlgorithmicSolution = (type) => {
    fetchAlgorithmSolution(type);
  };
  
  // Generate random starting position on game start
  useEffect(() => {
    if (gameStatus === 'setup') {
      resetBoard();
    }
  }, [gameStatus]);
  
  // Reset the board and generate a new random starting position
  const resetBoard = () => {
    // Clear the board
    const newBoard = Array(8).fill().map(() => Array(8).fill(-1));
    
    // Generate random starting position
    const startRow = Math.floor(Math.random() * 8);
    const startCol = Math.floor(Math.random() * 8);
    
    // Set initial knight position
    newBoard[startRow][startCol] = 0;
    
    setBoard(newBoard);
    setCurrentPosition([startRow, startCol]);
    setMoveNumber(1);
    setGameStatus('playing');
    setAlgorithmType('player');
    setShowingSolution(false);
    setSolutionPath(null);
    setIsVerified(false);
  };
  
  // Check if a move is valid
  const isValidMove = (row, col) => {
    // Check if position is on the board
    if (row < 0 || row >= 8 || col < 0 || col >= 8) return false;
    
    // Check if the cell is empty (not visited)
    if (board[row][col] !== -1) return false;
    
    // Check if this is a valid knight move from current position
    if (!currentPosition) return false;
    
    const [currentRow, currentCol] = currentPosition;
    
    return knightMoves.some(([dr, dc]) => 
      currentRow + dr === row && currentCol + dc === col
    );
  };
  
  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing' || algorithmType !== 'player') return;
    
    if (isValidMove(row, col)) {
      // Make the move
      const newBoard = [...board.map(boardRow => [...boardRow])];
      newBoard[row][col] = moveNumber;
      
      // Update the board and position
      const newPosition = [row, col];
      const newMoveNumber = moveNumber + 1;
      
      // Check if the game is won (all cells visited)
      if (newMoveNumber === 64) {
        setBoard(newBoard);
        setCurrentPosition(newPosition);
        setMoveNumber(newMoveNumber);
        setGameStatus('won');
        
        // Save the solution to the database
        savePlayerSolution();
        return;
      }
      
      // Check if there are any valid moves left from the new position
      const hasValidMovesLeft = knightMoves.some(([dr, dc]) => {
        const nextRow = row + dr;
        const nextCol = col + dc;
        
        // Check if position is on the board
        if (nextRow < 0 || nextRow >= 8 || nextCol < 0 || nextCol >= 8) return false;
        
        // Check if the cell is empty (not visited) in the new board
        return newBoard[nextRow][nextCol] === -1;
      });
      
      // Update the state
      setBoard(newBoard);
      setCurrentPosition(newPosition);
      setMoveNumber(newMoveNumber);
      
      // Update game status if no valid moves remain
      if (!hasValidMovesLeft) {
        setGameStatus('lost');
      }
    }
  };
  
  // Check if a cell has the knight (current position)
  const hasKnight = (row, col) => {
    if (!currentPosition) return false;
    const [currentRow, currentCol] = currentPosition;
    return currentRow === row && currentCol === col;
  };
  
  // Check if a cell is a valid next move
  const isValidNextMove = (row, col) => {
    return isValidMove(row, col);
  };
  
  // Get the move number for a cell (-1 if not visited)
  const getMoveNumber = (row, col) => {
    return board[row][col];
  };
  
  // Get the status message based on game state
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'setup':
        return 'Generating a new game...';
      case 'playing':
        return `Move ${moveNumber} of 64`;
      case 'won':
        return 'Congratulations! You completed the Knight\'s Tour!';
      case 'lost':
        return 'Game Over! No valid moves left.';
      default:
        return '';
    }
  };
  
  // Status color based on game state
  const getStatusColor = () => {
    switch (gameStatus) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };
  
  // Add a function to hide the solution
  const hideSolution = () => {
    setShowingSolution(false);
    setSolutionPath(null);
  };
  
  // Update the savePlayerSolution function to use the API endpoint
  const savePlayerSolution = async () => {
    if (gameStatus === 'won' && !isVerified) {
      try {
        // Convert board to a more compact representation for storage
        const boardRepresentation = board.flat().join(',');
        
        await axios.post('/api/knights-tour/solutions', {
          playerName,
          startPosition: board.findIndex(row => row.includes(0)).toString() + 
                        ',' + board[board.findIndex(row => row.includes(0))].indexOf(0),
          solution: boardRepresentation,
          algorithm: algorithmType,
          moveCount: moveNumber - 1
        });
        
        setIsVerified(true);
      } catch (error) {
        console.error('Error saving solution:', error);
      }
    }
  };
  
  // Update the player name and save it to localStorage
  const handlePlayerNameChange = (e) => {
    const newName = e.target.value;
    setPlayerName(newName);
    localStorage.setItem('playerName', newName);
  };
  
  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-between overflow-auto">
      <GameBackground />
      
      {/* Main content container */}
      <div className="flex-1 flex flex-col py-4 px-4 md:px-6 max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-center
                       bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Knight's Tour
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1 mb-3"></div>
        </div>
        
        {/* Game status */}
        <div className={`text-center mb-3 font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>
        
        {/* Main game area */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center lg:items-start overflow-auto">
          {/* Chessboard container */}
          <div className="lg:flex-1 flex flex-col items-center">
            <KnightTourBoard 
              board={board}
              handleCellClick={handleCellClick}
              hasKnight={hasKnight}
              isValidNextMove={isValidNextMove}
              getMoveNumber={getMoveNumber}
              solutionPath={solutionPath}
              showingSolution={showingSolution}
            />
            
            {/* Controls */}
            <div className="mt-3 flex gap-3 justify-center flex-wrap">
              <button 
                onClick={resetBoard}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                        transition-colors duration-200 shadow"
              >
                New Game
              </button>
              
              {gameStatus === 'playing' && (
                <>
                  <button 
                    onClick={() => showAlgorithmicSolution('backtracking')}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-sm text-white rounded-md 
                            transition-colors duration-200 shadow"
                  >
                    Backtracking Solution
                  </button>
                  <button 
                    onClick={() => showAlgorithmicSolution('warnsdorff')}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-sm text-white rounded-md 
                            transition-colors duration-200 shadow"
                  >
                    Warnsdorff Solution
                  </button>
                </>
              )}
              
              {showingSolution && (
                <button 
                  onClick={hideSolution}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-sm text-white rounded-md 
                          transition-colors duration-200 shadow"
                >
                  Hide Solution
                </button>
              )}
              
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                        transition-colors duration-200 shadow"
              >
                Back to Menu
              </button>
            </div>

            {/* Add this below the controls section */}
            {showingSolution && (
              <div className="mt-3 p-2 bg-gray-800/80 rounded-md">
                <p className="text-center text-white text-sm">
                  {algorithmType === 'backtracking' ? 'Backtracking' : 'Warnsdorff\'s'} Solution
                </p>
              </div>
            )}
          </div>
          
          {/* Side panel */}
          <div className="w-full lg:w-64 flex flex-col lg:max-h-full lg:overflow-auto">
            {/* Player information */}
            <div className="bg-gray-800/80 p-3 rounded-lg shadow-md mb-4">
              <h3 className="text-md font-medium text-white mb-2">Player Information</h3>
              <div className="flex items-center gap-2">
                <label htmlFor="playerName" className="text-gray-300 text-sm">Name:</label>
                <input 
                  type="text" 
                  id="playerName" 
                  value={playerName} 
                  onChange={handlePlayerNameChange} 
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Squares visited: {moveNumber - 1}/64
              </div>
            </div>
            
            {/* Game instructions */}
            <div className="bg-gray-800/80 p-3 rounded-lg shadow-md">
              <h3 className="text-md font-medium text-white mb-2">Instructions</h3>
              <div className="text-gray-400 text-xs">
                <p>The knight is placed randomly on the board.</p>
                <p className="mt-1">Click on valid squares to move the knight.</p>
                <p className="mt-1">Visit all 64 squares exactly once to win!</p>
                
                <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
                  <p className="font-medium text-gray-300">Legend:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Knight's position: <span className="text-white">♞</span></li>
                    <li>Valid moves: <span className="text-green-400">Highlighted squares</span></li>
                    <li>Numbers: <span className="text-gray-300">Order of visited squares</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Game result */}
            {(gameStatus === 'won' || gameStatus === 'lost') && (
              <div className={`mt-4 p-3 rounded-lg shadow-md ${gameStatus === 'won' ? 'bg-green-900/40' : 'bg-red-900/40'}`}>
                <h3 className={`text-lg font-medium ${gameStatus === 'won' ? 'text-green-300' : 'text-red-300'} mb-2`}>
                  {gameStatus === 'won' ? 'Victory!' : 'Game Over!'}
                </h3>
                <p className="text-white text-sm mb-2">
                  {gameStatus === 'won' 
                    ? `Congratulations ${playerName}! You completed the Knight's Tour.` 
                    : `Sorry ${playerName}, your knight got trapped after ${moveNumber - 1} moves.`}
                </p>
                <button 
                  onClick={resetBoard}
                  className={`w-full py-1.5 text-sm text-white rounded-md transition-colors duration-200 shadow
                           ${gameStatus === 'won' 
                            ? 'bg-green-700 hover:bg-green-600' 
                            : 'bg-red-700 hover:bg-red-600'}`}
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom chessboard component for Knight's Tour
function KnightTourBoard({ 
  board, 
  handleCellClick, 
  hasKnight, 
  isValidNextMove, 
  getMoveNumber, 
  solutionPath, // Add this prop
  showingSolution // Add this prop
}) {
  const colLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  return (
    <div className="relative bg-gray-700 p-1 md:p-3 rounded-lg shadow-xl w-full max-w-xl lg:max-w-2xl">
      <div className="flex flex-col">
        {[...Array(8).keys()].map((row) => {
          const rowNumber = 8 - row;
          const dataRow = 7 - row;
          
          return (
            <div key={row} className="flex">
              <div className="w-8 flex items-center justify-center text-gray-300 text-sm font-medium">
                {rowNumber}
              </div>
              
              <div className="flex flex-1">
                {Array(8).fill().map((_, col) => {
                  const moveNum = getMoveNumber(dataRow, col);
                  const isKnight = hasKnight(dataRow, col);
                  const isValidMove = isValidNextMove(dataRow, col);
                  
                  // Get solution move number if showing solution
                  const solutionMoveNum = showingSolution && solutionPath ? 
                    solutionPath[dataRow][col] : -2;
                  
                  // Cell color classes
                  const isDarkSquare = (dataRow + col) % 2 === 0;
                  let cellClasses = isDarkSquare 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-gray-600 hover:bg-gray-500";
                  
                  // Cell highlighting based on state
                  if (showingSolution && solutionMoveNum >= 0) {
                    // Colors for solution path steps
                    const stepPercent = solutionMoveNum / 63; // 0 to 1 based on move number
                    cellClasses = `bg-gradient-to-br from-green-700 to-blue-700 hover:from-green-600 hover:to-blue-600`;
                  } else if (isKnight) {
                    cellClasses = "bg-blue-700 hover:bg-blue-600";
                  } else if (moveNum >= 0) {
                    cellClasses = "bg-purple-700/80 hover:bg-purple-600";
                  } else if (isValidMove && !showingSolution) {
                    cellClasses = isDarkSquare 
                      ? "bg-green-800/60 hover:bg-green-700" 
                      : "bg-green-700/40 hover:bg-green-600";
                  }
                  
                  return (
                    <button
                      key={`${dataRow}-${col}`}
                      className={`aspect-square flex-1 ${cellClasses} flex items-center justify-center transition-all duration-200`}
                      onClick={() => handleCellClick(dataRow, col)}
                      aria-label={`Cell ${colLabels[col]}${rowNumber}`}
                      disabled={showingSolution}
                    >
                      {showingSolution && solutionMoveNum >= 0 ? (
                        <span className="text-white text-xs md:text-sm font-medium">
                          {solutionMoveNum === 0 ? 'S' : solutionMoveNum}
                        </span>
                      ) : isKnight ? (
                        <span className="text-white text-2xl md:text-3xl">♞</span>
                      ) : moveNum >= 0 ? (
                        <span className="text-white text-xs md:text-sm font-medium">
                          {moveNum === 0 ? 'S' : moveNum}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Column labels */}
        <div className="flex">
          <div className="w-8 flex-shrink-0"></div>
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

export default KnightsTour;