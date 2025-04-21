import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chessboard from '../components/chessboard/Chessboard';
import PlayerInfo from '../components/chessboard/PlayerInfo';
import GameInstructions from '../components/chessboard/GameInstructions';
import GameBackground from '../components/chessboard/GameBackground';

function EightQueens() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(8).fill(-1));
  const [playerName, setPlayerName] = useState('Player');
  const [solutions, setSolutions] = useState([]);
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionIndex, setSolutionIndex] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) setPlayerName(savedName);
  }, []);

  // Utility functions
  const allQueensPlaced = board.every(col => col !== -1);
  const isSolutionValid = () => {
    if (!allQueensPlaced) return false;
    for (let r1 = 0; r1 < 8; r1++) {
      for (let r2 = r1 + 1; r2 < 8; r2++) {
        const c1 = board[r1];
        const c2 = board[r2];
        if (c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
          return false;
        }
      }
    }
    return true;
  };

  // Fetch solutions from backend API
  const findAllSolutions = async () => {
    const res = await fetch('http://localhost:5000/api/eightqueens/solutions');
    const data = await res.json();
    setSolutions(data.solutions);
    setSolutionIndex(0);
    setBoard(data.solutions[0]);
    setShowingSolution(true);
  };

  // Show next solution
  const handleNextSolution = () => {
    const nextIndex = (solutionIndex + 1) % solutions.length;
    setSolutionIndex(nextIndex);
    setBoard(solutions[nextIndex]);
  };

  const handleCellClick = (row, col) => {
    if (showingSolution) return; // Prevent editing when showing solution
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      if (prevBoard[row] === col) {
        newBoard[row] = -1;
      } else {
        newBoard[row] = col;
      }
      return newBoard;
    });
  };

  const hasQueen = (row, col) => board[row] === col;
  const isUnderAttack = (row, col) => {
    if (hasQueen(row, col)) return false;
    for (let i = 0; i < 8; i++) {
      if (board[i] === -1) continue;
      if (board[i] === col) return true;
      const rowDiff = Math.abs(i - row);
      const colDiff = Math.abs(board[i] - col);
      if (rowDiff === colDiff) return true;
    }
    return false;
  };

  const resetBoard = () => {
    setBoard(Array(8).fill(-1));
    setShowingSolution(false);
    setSolutions([]);
    setSolutionIndex(0);
  };

  // Helper function to convert board array to algebraic notation string
  const convertToAlgebraic = (board) => {
    const colLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const positions = [];
    for (let row = 0; row < 8; row++) { // Assuming row 0 is the bottom row (rank 1)
      const col = board[row];
      if (col !== -1) { // Only include placed queens
        const algebraicCol = colLabels[col];
        // Corrected calculation: row index + 1 gives the rank number
        const algebraicRow = row + 1; 
        positions.push(`${algebraicCol}${algebraicRow}`);
      }
    }
    // Sort alphabetically/numerically for consistent unique key
    return positions.sort().join(','); 
  };

  const submitSolution = async () => {
    const answer = convertToAlgebraic(board); 
    const gameName = "Eight Queens"; // Define the game name
  
    try { // Add try...catch for fetch errors
      const res = await fetch('http://localhost:5000/api/queen-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include gameName in the body
        body: JSON.stringify({ playerName, answer, gameName }) 
      });
  
      // Check if response is ok before parsing JSON
      if (!res.ok) {
          // Try to parse error message from backend if available
          let errorData;
          try {
              errorData = await res.json();
          } catch (parseError) {
              // If parsing fails, use status text
              throw new Error(res.statusText || `HTTP error! status: ${res.status}`);
          }
          throw new Error(errorData.message || errorData.error || `HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
      alert(data.message); // Success
      resetBoard(); // Reset board on successful submission
  
    } catch (error) {
        console.error("Submission failed:", error);
        alert('Submission failed: ' + error.message); // Show specific error
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-between overflow-auto">
      <GameBackground />
      <div className="flex-1 flex flex-col py-4 px-4 md:px-6 max-h-full overflow-hidden">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-center
                       bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Eight Queens' Puzzle
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1 mb-3"></div>
        </div>
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center lg:items-start overflow-auto">
          <div className="lg:flex-1 flex flex-col items-center">
            <Chessboard 
              board={board}
              handleCellClick={handleCellClick}
              hasQueen={hasQueen}
              isUnderAttack={isUnderAttack}
            />
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
              {!showingSolution && (
                <button
                  onClick={findAllSolutions}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-sm text-white rounded-md transition-colors duration-200 shadow"
                >
                  Show Solution
                </button>
              )}
              {showingSolution && (
                <button
                  onClick={handleNextSolution}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-sm text-white rounded-md transition-colors duration-200 shadow"
                >
                  Next Solution
                </button>
              )}
              {isSolutionValid() && !showingSolution && (
                <button
                  onClick={submitSolution}
                  className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-sm text-white rounded-md transition-colors duration-200 shadow"
                >
                  Submit Solution
                </button>
              )}
            </div>
            {showingSolution && (
              <div className="mt-2 text-gray-300 text-sm">
                Showing solution {solutionIndex + 1} of {solutions.length}
              </div>
            )}
          </div>
          <div className="w-full lg:w-64 flex flex-col lg:max-h-full lg:overflow-auto">
            <PlayerInfo
              playerName={playerName}
              setPlayerName={setPlayerName}
              board={board}
              allQueensPlaced={allQueensPlaced}
              isSolutionValid={isSolutionValid}
            />
            <GameInstructions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EightQueens;