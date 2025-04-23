import React, { useState, useEffect } from 'react';
import Board from '../components/TicTacToe/Board';
import PlayerModal from '../components/PlayerModal';
import { getComputerMove } from '../components/TicTacToe/AiLogic';

const TicTacToe = ({ returnToMenu }) => {
  const [board, setBoard] = useState(Array(25).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameInputOpen, setNameInputOpen] = useState(false);
  const [aiAlgorithm, setAiAlgorithm] = useState('heuristic');
  const [gameHistory, setGameHistory] = useState([]);

  // Check for winner after each move
  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setShowModal(true);
      addToHistory(gameWinner);
    } else if (!board.includes(null)) {
      setWinner('draw');
      setShowModal(true);
      addToHistory('draw');
    }
  }, [board]);

  // Computer's turn
  useEffect(() => {
    if (!isHumanTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, winner]);

  const calculateWinner = (squares) => {
    // Check rows
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 2; col++) {
        const idx = row * 5 + col;
        if (
          squares[idx] && 
          squares[idx] === squares[idx + 1] && 
          squares[idx] === squares[idx + 2] && 
          squares[idx] === squares[idx + 3]
        ) return squares[idx];
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 2; row++) {
        const idx = row * 5 + col;
        if (
          squares[idx] && 
          squares[idx] === squares[idx + 5] && 
          squares[idx] === squares[idx + 10] && 
          squares[idx] === squares[idx + 15]
        ) return squares[idx];
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const idx = row * 5 + col;
        if (
          squares[idx] && 
          squares[idx] === squares[idx + 6] && 
          squares[idx] === squares[idx + 12] && 
          squares[idx] === squares[idx + 18]
        ) return squares[idx];
      }
    }

    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row < 2; row++) {
      for (let col = 3; col < 5; col++) {
        const idx = row * 5 + col;
        if (
          squares[idx] && 
          squares[idx] === squares[idx + 4] && 
          squares[idx] === squares[idx + 8] && 
          squares[idx] === squares[idx + 12]
        ) return squares[idx];
      }
    }

    return null;
  };

  const addToHistory = (result) => {
    setGameHistory(prev => [
      ...prev,
      {
        date: new Date().toISOString(),
        result,
        algorithm: aiAlgorithm,
        board: [...board]
      }
    ]);
  };

  const handleClick = (index) => {
    if (board[index] || !isHumanTurn || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = '✕';
    setBoard(newBoard);
    setIsHumanTurn(false);
  };

  const makeComputerMove = () => {
    const { move, timeTaken } = getComputerMove(board, aiAlgorithm);
    console.log(`AI (${aiAlgorithm}) move took ${timeTaken.toFixed(2)}ms`);
    
    if (move !== undefined) {
      const newBoard = [...board];
      newBoard[move] = '⭘';
      setBoard(newBoard);
    }
    setIsHumanTurn(true);
  };

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setIsHumanTurn(true);
    setWinner(null);
    setShowModal(false);
  };

  const handleSaveResult = () => {
    if (playerName.trim()) {
      // In a real app, you would send this to your backend
      console.log('Saved result:', {
        playerName,
        result: winner === '✕' ? 'win' : winner === '⭘' ? 'loss' : 'draw',
        algorithm: aiAlgorithm,
        moves: gameHistory
      });
      resetGame();
      setNameInputOpen(false);
      setPlayerName('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>

      <button 
        onClick={returnToMenu}
        className="absolute top-4 left-4 px-4 py-2 text-gray-300 hover:text-white transition-all"
      >
        ← Back to Menu
      </button>

      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text mb-6">
        5×5 Tic-Tac-Toe
      </h1>

      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={() => setAiAlgorithm('heuristic')}
          className={`px-4 py-2 rounded-lg ${aiAlgorithm === 'heuristic' ? 
            'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Heuristic AI
        </button>
        <button
          onClick={() => setAiAlgorithm('minimax')}
          className={`px-4 py-2 rounded-lg ${aiAlgorithm === 'minimax' ? 
            'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Minimax AI
        </button>
      </div>

      <div className="text-xl text-white mb-4">
        {winner ? (
          <span className="text-green-400 font-semibold animate-pulse">
            {winner === '✕' ? '🎉 You won!' : winner === '⭘' ? '🤖 Computer won!' : '🤝 Draw!'}
          </span>
        ) : (
          <span className={`font-semibold ${isHumanTurn ? 'text-blue-400' : 'text-purple-400'}`}>
            {isHumanTurn ? 'Your turn (✕)' : 'Computer thinking...'}
          </span>
        )}
      </div>

      <Board 
        board={board} 
        onCellClick={handleClick} 
        isHumanTurn={isHumanTurn}
        winner={winner}
      />

      <div className="flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 rounded-full text-white bg-gray-700 hover:bg-gray-600 transition-all"
        >
          Reset Board
        </button>
        <button
          onClick={returnToMenu}
          className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-all"
        >
          Main Menu
        </button>
      </div>

      {showModal && (
        <PlayerModal 
          winner={winner}
          onClose={() => setShowModal(false)}
          onSave={() => setNameInputOpen(true)}
          onPlayAgain={resetGame}
        />
      )}

      {nameInputOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-sm w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Save Your Score</h3>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setNameInputOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveResult}
                disabled={!playerName.trim()}
                className={`px-4 py-2 rounded-lg ${playerName.trim() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 cursor-not-allowed'} text-white transition-all`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;