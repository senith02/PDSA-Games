import { useState } from 'react'
import GameMenu from './components/GameMenu'
import TowerOfHanoi from './components/TowerOfHanoi'

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  // Function to handle navigation to a specific game
  const navigateToGame = (gameId) => {
    setCurrentGame(gameId);
  };

  // Function to return to the game menu
  const returnToMenu = () => {
    setCurrentGame(null);
  };

  // Render the appropriate component based on currentGame state
  const renderCurrentView = () => {
    switch (currentGame) {
      case 'hanoi':
        return <TowerOfHanoi onBack={returnToMenu} />;
      // Add cases for other games when they're implemented
      default:
        return <GameMenu onGameSelect={navigateToGame} />;
    }
  };

  return renderCurrentView();
}

export default App
