import React, { useState, useEffect } from 'react';

const PlayerModal = ({ winner, onClose, onSave, onPlayAgain }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  
  // Load saved name when modal opens
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) setPlayerName(savedName);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    localStorage.setItem('playerName', playerName.trim());
    onSave(playerName.trim());
    setPlayerName('');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            {winner === '✕' ? '🎉 You Won!' : winner === '⭘' ? '🤖 Computer Won!' : '🤝 Game Drawn!'}
          </h2>
          <p className="text-gray-400 mt-1">
            {winner === '✕' ? 'Congratulations!' : winner === '⭘' ? 'Better luck next time!' : 'It was a close match!'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="player-name-input" className="block text-gray-300 mb-2 text-sm">
              Save your score:
            </label>
            <input
              id="player-name-input"
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Your name"
              autoComplete="name"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md transition-colors duration-200 shadow-md mb-3"
          >
            Save Score
          </button>
        </form>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PlayerModal;