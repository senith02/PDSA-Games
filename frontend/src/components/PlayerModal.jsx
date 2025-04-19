import React, { useState, useEffect } from 'react';

function PlayerModal({ isOpen, onClose, onConfirm, selectedGame }) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  
  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Get previous name from localStorage if available
      const savedName = localStorage.getItem('playerName');
      if (savedName) {
        setPlayerName(savedName);
      }
      
      // Add a small delay to ensure the modal is rendered before focusing
      setTimeout(() => {
        const inputElement = document.getElementById('player-name-input');
        if (inputElement) {
          inputElement.focus();
        }
      }, 50);
    }
  }, [isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // Store player name in localStorage
    localStorage.setItem('playerName', playerName.trim());
    
    // Confirm and close modal
    onConfirm(playerName.trim());
  };
  
  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700 transform transition-all duration-300"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Ready to Play
          </h2>
          <p className="text-gray-400 mt-1">
            {selectedGame?.name || 'the selected game'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="player-name-input" className="block text-gray-300 mb-2 text-sm">
              Enter your name:
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
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md transition-colors duration-200 shadow-md"
            >
              Start Playing
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default PlayerModal;