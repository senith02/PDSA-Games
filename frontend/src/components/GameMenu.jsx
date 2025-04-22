import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerModal from './PlayerModal';

/**
 * GameMenu component serves as the landing page for AlgoGameHub
 * Displays a grid of game options for the user to select from
 */
function GameMenu() {
  // State to track which game is selected
  const [selectedGame, setSelectedGame] = useState(null);
  // State to handle animation effects
  const [isPlaying, setIsPlaying] = useState(false);
  // State to control the player modal
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  
  // Array of available games with descriptions and icons
  const games = [
    { 
      id: 'tictactoe', 
      name: 'Tic-Tac-Toe',
      description: 'Classic game of X and O',
      icon: '✕', // Simplified icon for better display
      altIcon: '⭘'
    },
    { 
      id: 'tsp', 
      name: 'Traveling Salesman',
      description: 'Find the shortest possible route',
      icon: '🗺️' 
    },
    { 
      id: 'hanoi', 
      name: 'Tower of Hanoi',
      description: 'Solve the disk stacking puzzle',
      icon: '🏔️' 
    },
    { 
      id: 'eightqueens', 
      name: "Eight Queens",
      description: 'Place 8 queens without threats',
      icon: '♛' 
    },
    { 
      id: 'knight', 
      name: "Knight's Tour",
      description: 'Visit each square once with a knight',
      icon: '♞' 
    }
  ];
  
  // Handler for game selection
  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    console.log(`Selected game: ${gameId}`);
  };
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handler for play button - show modal instead of immediately playing
  const handlePlay = () => {
    if (!selectedGame) return;
    setShowPlayerModal(true);
  };
  
  // Handler for when user confirms name and wants to play
  const handleStartGame = (playerName) => {
    setShowPlayerModal(false);
    setIsPlaying(true);
    
    // Store player name in localStorage
    localStorage.setItem('playerName', playerName);
    
    console.log(`Starting game: ${selectedGame} with player: ${playerName}`);
    
    // Simulate game loading with a timeout
    setTimeout(() => {
      setIsPlaying(false);
      navigate(`/${selectedGame}`); // Redirect to the selected game's page
    }, 1500);
  };
  
  // Find the currently selected game object
  const selectedGameObject = selectedGame ? games.find(game => game.id === selectedGame) : null;

  // Custom icon rendering for Tic-Tac-Toe to solve overflow
  const renderIcon = (game) => {
    if (game.id === 'tictactoe') {
      return (
        <div className="flex items-center justify-center">
          <span className="mr-1">{game.icon}</span>
          <span>{game.altIcon}</span>
        </div>
      );
    }
    return game.icon;
  };
  
  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header with gradient text effect - reduced vertical spacing */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-2
                      bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text
                      animate-fadeIn">
          AlgoGameHub
        </h1>
        
        {/* Tagline - smaller */}
        <p className="text-gray-300 text-lg md:text-xl mb-2 text-center font-light">
          Challenge Your Mind with Algorithmic Games
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1"></div>
      </div>
      
      {/* Game selection grid - smaller cards and tighter spacing */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mb-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameSelect(game.id)}
            className={`
              group relative overflow-hidden
              bg-gray-800/80 backdrop-blur-sm 
              p-5 rounded-xl shadow-lg transition-all duration-300 ease-in-out
              hover:scale-102 hover:shadow-xl border border-gray-700 cursor-pointer
              ${selectedGame === game.id ? 'ring-2 ring-purple-500 bg-gray-700/90' : ''}
            `}
          >
            {/* Modified background icon - smaller and better positioned */}
            <div className="absolute -right-2 -top-2 w-16 h-16 flex items-center justify-center 
                         opacity-30 group-hover:opacity-60 transition-all duration-300">
              <div className="text-3xl bg-gradient-to-br from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {game.icon}
              </div>
            </div>
            
            {/* Game info with icon at the top - smaller */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2
                           border border-gray-600 shadow-inner text-xl transform group-hover:scale-110
                           transition-all duration-300 text-blue-400 group-hover:text-purple-400">
                {renderIcon(game)}
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-1">{game.name}</h2>
              <p className="text-gray-400 text-xs text-center transition-all duration-300 
                           group-hover:text-gray-300">{game.description}</p>
            </div>
            
            {/* Bottom progress bar */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 
                         transition-all duration-500 ease-out
                         ${selectedGame === game.id ? 'w-full' : 'w-0 group-hover:w-1/4'}`}></div>
          </button>
        ))}
      </div>
      
      {/* Play button - slightly smaller */}
      <div className="relative z-10 mt-2 flex flex-col items-center">
        <button
          onClick={handlePlay}
          disabled={!selectedGame || isPlaying}
          className={`
            px-8 py-3 rounded-full text-lg font-bold
            transition-all duration-300 ease-in-out transform cursor-pointer
            shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
            ${selectedGame ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-xl' 
                          : 'bg-gray-700 text-gray-400'}
            ${isPlaying ? 'animate-pulse' : ''}
          `}
        >
          {isPlaying ? (
            <span className="flex items-center">
              Loading
              <span className="ml-2 flex space-x-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </span>
          ) : 'Play Game'}
        </button>
        
        {/* Selected game indicator - smaller and condensed */}
        {selectedGame && !isPlaying && (
          <p className="mt-3 text-purple-400 animate-fadeIn text-sm">
            Ready to play: {games.find(game => game.id === selectedGame)?.name}
          </p>
        )}
        
        {/* Instructions if no game is selected */}
        {!selectedGame && (
          <p className="mt-3 text-gray-500 text-center animate-fadeIn text-sm">
            Select a game from above to begin
          </p>
        )}
      </div>
      
      {/* Player Name Modal */}
      <PlayerModal 
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        onConfirm={handleStartGame}
        selectedGame={selectedGameObject}
      />
    </div>
  );
}

export default GameMenu;