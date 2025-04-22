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
  const [backtrackingSolution, setBacktrackingSolution] = useState(null);
  const [warnsdorffSolution, setWarnsdorffSolution] = useState(null);
  const [showingBacktracking, setShowingBacktracking] = useState(false);
  const [showingWarnsdorff, setShowingWarnsdorff] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); // Add error state
  
  // Add a function to call the backend API for solutions
  const fetchAlgorithmSolution = async (algorithm) => {
    if (!currentPosition) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      setAlgorithmType(algorithm);
      
      const [startRow, startCol] = currentPosition;
      
      const response = await axios.get('/api/knights-tour/solution', {
        params: {
          algorithm,
          startRow,
          startCol
        },
        // Increase timeout for backtracking algorithm
        timeout: algorithm === 'backtracking' ? 30000 : 10000 // 30 seconds for backtracking, 10 for others
      });
      
      // Update the appropriate solution state based on algorithm
      if (algorithm === 'backtracking') {
        setBacktrackingSolution(response.data.solution);
        setShowingBacktracking(true);
      } else if (algorithm === 'warnsdorff') {
        setWarnsdorffSolution(response.data.solution);
        setShowingWarnsdorff(true);
      }
      
      console.log(`${algorithm} solution found in ${response.data.executionTime.toFixed(2)} ms`);
      
    } catch (error) {
      console.error('Error fetching solution:', error);
      if (error.code === 'ECONNABORTED') {
        setErrorMessage(`The ${algorithm} algorithm is taking too long to compute. Try using Warnsdorff's algorithm instead, which is much faster.`);
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setErrorMessage('Cannot connect to server. Please make sure the server is running.');
      } else if (error.response) {
        setErrorMessage(`Server error: ${error.response.data.error || 'Unknown error'}`);
      } else {
        setErrorMessage('Failed to load solution. Please try again.');
      }
      
      // Clear the corresponding solution state on error
      if (algorithm === 'backtracking') {
        setBacktrackingSolution(null);
        setShowingBacktracking(false);
      } else if (algorithm === 'warnsdorff') {
        setWarnsdorffSolution(null);
        setShowingWarnsdorff(false);
      }
    } finally {
      setIsLoading(false);
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
    setShowingBacktracking(false);
    setShowingWarnsdorff(false);
    setBacktrackingSolution(null);
    setWarnsdorffSolution(null);
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
  const hideSolution = (algorithm) => {
    if (algorithm === 'backtracking') {
      setShowingBacktracking(false);
    } else if (algorithm === 'warnsdorff') {
      setShowingWarnsdorff(false);
    }
  };
  
  // Update the savePlayerSolution function to use the API endpoint
  const savePlayerSolution = async () => {
    if (gameStatus === 'won' && !isVerified) {
      try {
        // Convert board to a more compact representation for storage
        const boardRepresentation = board.flat().join(',');
        
        // Use the proxy URL instead of the hardcoded URL
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
              backtrackingSolution={backtrackingSolution}
              warnsdorffSolution={warnsdorffSolution}
              showingBacktracking={showingBacktracking}
              showingWarnsdorff={showingWarnsdorff}
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
                    className={`px-3 py-1.5 ${showingBacktracking ? 'bg-blue-900' : 'bg-blue-700 hover:bg-blue-600'} 
                              text-sm text-white rounded-md transition-colors duration-200 shadow`}
                    disabled={isLoading}
                  >
                    {isLoading && algorithmType === 'backtracking' ? 'Loading...' : 'Backtracking Solution'}
                  </button>
                  <button 
                    onClick={() => showAlgorithmicSolution('warnsdorff')}
                    className={`px-3 py-1.5 ${showingWarnsdorff ? 'bg-purple-900' : 'bg-purple-700 hover:bg-purple-600'} 
                              text-sm text-white rounded-md transition-colors duration-200 shadow`}
                    disabled={isLoading}
                  >
                    {isLoading && algorithmType === 'warnsdorff' ? 'Loading...' : 'Warnsdorff Solution'}
                  </button>
                </>
              )}
              
              {(showingBacktracking || showingWarnsdorff) && (
                <div className="flex gap-2">
                  {showingBacktracking && (
                    <button 
                      onClick={() => hideSolution('backtracking')}
                      className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-sm text-white rounded-md 
                                transition-colors duration-200 shadow"
                    >
                      Hide Backtracking
                    </button>
                  )}
                  {showingWarnsdorff && (
                    <button 
                      onClick={() => hideSolution('warnsdorff')}
                      className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-sm text-white rounded-md 
                                transition-colors duration-200 shadow"
                    >
                      Hide Warnsdorff
                    </button>
                  )}
                </div>
              )}
              
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md 
                        transition-colors duration-200 shadow"
              >
                Back to Menu
              </button>
            </div>

            {/* Update the solution display section */}
            {(showingBacktracking || showingWarnsdorff) && (
              <div className="mt-3 space-y-2">
                {showingBacktracking && (
                  <div className="p-2 bg-blue-800/80 rounded-md">
                    <p className="text-center text-white text-sm">
                      Backtracking Solution Path
                    </p>
                  </div>
                )}
                {showingWarnsdorff && (
                  <div className="p-2 bg-purple-800/80 rounded-md">
                    <p className="text-center text-white text-sm">
                      Warnsdorff's Solution Path
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Display error message */}
            {errorMessage && (
              <div className="mt-3 p-2 bg-red-800/80 rounded-md">
                <p className="text-center text-white text-sm">
                  {errorMessage}
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
  backtrackingSolution,
  warnsdorffSolution,
  showingBacktracking,
  showingWarnsdorff
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
                  
                  // Get solution move numbers if showing solutions
                  const backtrackingMoveNum = showingBacktracking && backtrackingSolution ? 
                    backtrackingSolution[dataRow][col] : -2;
                  const warnsdorffMoveNum = showingWarnsdorff && warnsdorffSolution ? 
                    warnsdorffSolution[dataRow][col] : -2;
                  
                  // Cell color classes
                  const isDarkSquare = (dataRow + col) % 2 === 0;
                  let cellClasses = isDarkSquare 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-gray-600 hover:bg-gray-500";
                  
                  // Cell highlighting based on state
                  if (showingBacktracking && backtrackingMoveNum >= 0) {
                    cellClasses = `bg-gradient-to-br from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400`;
                  } else if (showingWarnsdorff && warnsdorffMoveNum >= 0) {
                    cellClasses = `bg-gradient-to-br from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400`;
                  } else if (isKnight) {
                    cellClasses = "bg-purple-700/80 hover:bg-purple-600";
                  } else if (isValidMove && !showingBacktracking && !showingWarnsdorff) {
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
                      disabled={showingBacktracking || showingWarnsdorff}
                    >
                      {showingBacktracking && backtrackingMoveNum >= 0 ? (
                        <span className="text-white text-xs md:text-sm font-medium">
                          {backtrackingMoveNum === 0 ? 'S' : backtrackingMoveNum}
                        </span>
                      ) : showingWarnsdorff && warnsdorffMoveNum >= 0 ? (
                        <span className="text-white text-xs md:text-sm font-medium">
                          {warnsdorffMoveNum === 0 ? 'S' : warnsdorffMoveNum}
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