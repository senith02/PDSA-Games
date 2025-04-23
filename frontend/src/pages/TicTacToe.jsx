import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Board from '../components/TicTacToe/Board';
// Remove PlayerModal import if no longer needed elsewhere
// import PlayerModal from '../components/PlayerModal'; 
import { getComputerMove } from '../components/TicTacToe/AiLogic';
import TicTacToeInstructions from '../components/TicTacToe/TicTacToeInstructions'; // Import new component
import TicTacToePlayerInfo from '../components/TicTacToe/TicTacToePlayerInfo'; // Import new component
import GameBackground from '../components/chessboard/GameBackground'; // Reuse background

const TicTacToe = () => { 
  const navigate = useNavigate(); 
  const [board, setBoard] = useState(Array(25).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  // Remove modal states
  // const [showModal, setShowModal] = useState(false); 
  const [playerName, setPlayerName] = useState('');
  // const [nameInputOpen, setNameInputOpen] = useState(false);
  const [aiAlgorithm, setAiAlgorithm] = useState('heuristic');
  const [gameHistory, setGameHistory] = useState([]);
  // const [winningLine, setWinningLine] = useState(null); 

  // Load player name from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Check for winner (using corrected calculateWinner)
  const calculateWinner = (squares) => {
    // ... (calculateWinner function remains the same) ...
    const lines = [];
    const n = 5; // Board size

    // Generate rows
    for (let i = 0; i < n; i++) {
      lines.push(Array.from({ length: n }, (_, k) => i * n + k));
    }
    // Generate columns
    for (let j = 0; j < n; j++) {
      lines.push(Array.from({ length: n }, (_, k) => k * n + j));
    }
    // Generate diagonals
    lines.push(Array.from({ length: n }, (_, k) => k * n + k)); // Top-left to bottom-right
    lines.push(Array.from({ length: n }, (_, k) => k * n + (n - 1 - k))); // Top-right to bottom-left

    // Check all lines for a winner (5 in a row)
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        // Return the winner and the winning line indices
        return { winner: squares[a], line: lines[i] }; 
      }
    }

    return null; // No winner found
  };

  useEffect(() => {
    const winnerInfo = calculateWinner(board);
    if (winnerInfo) {
      setWinner(winnerInfo.winner);
      // setWinningLine(winnerInfo.line); // Optional
      // Remove modal logic
      // setShowModal(true); 
      addToHistory(winnerInfo.winner);
    } else if (!board.includes(null) && !winner) { // Check !winner to prevent setting draw after win
      setWinner('draw');
      // Remove modal logic
      // setShowModal(true);
      addToHistory('draw');
    } else {
      // Reset winning line if no winner
      // setWinningLine(null); // Optional
    }
  }, [board, winner]); // Add winner dependency here too

  // Computer's turn
  useEffect(() => {
    if (!isHumanTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500); // Delay for AI 'thinking' time
      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, winner, board]); 

  const addToHistory = (result) => {
    // Only add if the result is new (prevent duplicates on re-renders)
    if (!gameHistory.some(entry => entry.result === result && JSON.stringify(entry.board) === JSON.stringify(board))) {
        setGameHistory(prev => [
          ...prev,
          {
            date: new Date().toISOString(),
            result,
            algorithm: aiAlgorithm,
            board: [...board] // Capture board state at the time of adding
          }
        ]);
    }
  };

  const handleClick = (index) => {
    if (board[index] || !isHumanTurn || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = '✕'; // Human player
    setBoard(newBoard);
    setIsHumanTurn(false); // Switch to computer's turn
  };

  const makeComputerMove = () => {
    // ... (makeComputerMove function remains the same) ...
    const { move, timeTaken } = getComputerMove(board, aiAlgorithm);
    console.log(`AI (${aiAlgorithm}) move took ${timeTaken.toFixed(2)}ms`);
    
    if (move !== undefined && board[move] === null) { // Ensure move is valid and cell is empty
      const newBoard = [...board];
      newBoard[move] = '⭘'; // Computer player
      setBoard(newBoard);
    } else if (move === undefined && !board.includes(null)) {
        // Handle case where AI returns no move and board is full (should be draw)
        console.log("AI couldn't find a move, likely a draw.");
    } else if (move !== undefined && board[move] !== null) {
        // Handle case where AI tries to play on an occupied cell (should not happen with correct logic)
        console.error("AI attempted to play on an occupied cell:", move);
        // Fallback: find another random move if possible
        const emptyCells = board.map((c, i) => c === null ? i : null).filter(v => v !== null);
        if (emptyCells.length > 0) {
            const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newBoard = [...board];
            newBoard[randomMove] = '⭘';
            setBoard(newBoard);
        }
    }
    setIsHumanTurn(true); // Switch back to human's turn
  };

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setIsHumanTurn(true);
    setWinner(null);
    // Remove modal state reset
    // setShowModal(false); 
    // setWinningLine(null); // Optional
  };

  const handleSaveResult = () => {
    // Implement your logic to send data to the database here
    // You have access to: playerName, winner, aiAlgorithm, board, gameHistory
    console.log('Submitting result to database...');
    console.log('Player:', playerName);
    console.log('Winner:', winner); // '✕', '⭘', or 'draw'
    console.log('AI Algorithm:', aiAlgorithm);
    // You might want to send the final board state or the relevant history entry
    console.log('Final Board:', board); 
    
    // Example: Find the latest history entry for this game end state
    const latestResult = gameHistory[gameHistory.length - 1];
    console.log('Latest History Entry:', latestResult);

    // After successful submission, you might want to navigate away or disable the button
    // navigate('/'); // Option: navigate back to menu after saving
    alert('Result submitted (check console)!'); // Placeholder feedback
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-between overflow-auto">
      <GameBackground /> {/* Reused background */}
      <div className="flex-1 flex flex-col py-4 px-4 md:px-6 max-h-full overflow-hidden">
        {/* Header */}
        {/* ... (header remains the same) ... */}
         <div className="flex flex-col items-center mb-3">
          <h1 className="text-3xl md:text-4xl font-bold text-center
                       bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            5×5 Tic-Tac-Toe
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1 mb-3"></div>
        </div>


        {/* Main Content Area (Board + Side Panels) */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center lg:items-start overflow-auto">
          
          {/* Board Area */}
          <div className="lg:flex-1 flex flex-col items-center">
            {/* AI Selection */}
            {/* ... (AI selection remains the same) ... */}
             <div className="mb-4 flex gap-2 justify-center">
              <button
                onClick={() => setAiAlgorithm('heuristic')}
                disabled={!!winner} // Disable AI change after game ends
                className={`px-3 py-1.5 rounded-md text-sm ${aiAlgorithm === 'heuristic' ? 
                  'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${!!winner ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Heuristic AI
              </button>
              <button
                onClick={() => setAiAlgorithm('minimax')}
                disabled={!!winner} // Disable AI change after game ends
                className={`px-3 py-1.5 rounded-md text-sm ${aiAlgorithm === 'minimax' ? 
                  'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${!!winner ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Minimax AI
              </button>
            </div>


            {/* Game Board */}
            <Board
              board={board}
              onCellClick={handleClick}
              isHumanTurn={isHumanTurn} 
              winner={winner}           
              // isWinningCell={(index) => winningLine?.includes(index)} // Optional prop for highlighting
            />

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md transition-colors duration-200 shadow"
              >
                Reset Board
              </button>
              <button 
                onClick={() => navigate('/')} // Use navigate
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md transition-colors duration-200 shadow"
              >
                Back to Menu
              </button>
              {/* Conditionally render Submit button */}
              {winner && (
                 <button 
                    onClick={handleSaveResult}
                    disabled={!playerName.trim()} // Disable if player name is empty
                    className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 shadow ${
                      !playerName.trim() 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Submit Result
                  </button>
              )}
            </div>
          </div>

          {/* Side Panel Area */}
          {/* ... (Side panel remains the same) ... */}
           <div className="w-full lg:w-64 flex flex-col lg:max-h-full lg:overflow-auto gap-4 mt-4 lg:mt-0">
            <TicTacToePlayerInfo
              playerName={playerName}
              setPlayerName={setPlayerName}
              isHumanTurn={isHumanTurn}
              winner={winner}
              aiAlgorithm={aiAlgorithm}
            />
            <TicTacToeInstructions />
          </div>
        </div>
      </div>

      {/* Remove Modals */}
      {/* {showModal && (...)} */}
      {/* {nameInputOpen && (...)} */}
    </div>
  );
};

export default TicTacToe;