import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBackground from '../components/chessboard/GameBackground';
import HanoiTower from '../components/TowerOfHanoi/HanoiTower';
import TowerControls from '../components/TowerOfHanoi/TowerControls';
import HanoiInstructions from '../components/TowerOfHanoi/HanoiInstructions';
import HanoiPlayerInfo from '../components/TowerOfHanoi/HanoiPlayerInfo';
import axios from 'axios';

function TowerOfHanoi() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('Player');
  const [disks, setDisks] = useState(3); // Default disk count
  const [towers, setTowers] = useState([[], [], []]);
  const [moves, setMoves] = useState(0);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [algorithm, setAlgorithm] = useState('recursive'); // 'recursive' or 'iterative'
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [autoSolveMoves, setAutoSolveMoves] = useState([]);
  const [autoSolveIndex, setAutoSolveIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [minMoves, setMinMoves] = useState(7); // 2^n - 1 for default 3 disks
  const [executionTime, setExecutionTime] = useState(0);

  // Initialize the game on component mount or disk count change
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
    resetGame();
  }, [disks]);

  // Handle auto-solving animation
  useEffect(() => {
    if (isAutoSolving && autoSolveIndex < autoSolveMoves.length) {
      const timer = setTimeout(() => {
        const [fromTower, toTower] = autoSolveMoves[autoSolveIndex];
        
        // Execute the move on the towers
        const moveSuccessful = moveDisk(fromTower, toTower, true);
        
        if (moveSuccessful) {
          // Only increment if the move was successful
          setAutoSolveIndex(prevIndex => prevIndex + 1);
        } else {
          console.error(`Invalid move in auto-solve: [${fromTower}, ${toTower}]`);
          // Skip this move if invalid
          setAutoSolveIndex(prevIndex => prevIndex + 1);
        }
      }, 800); // Animation speed - adjust as needed
      
      return () => clearTimeout(timer);
    } else if (isAutoSolving && autoSolveIndex >= autoSolveMoves.length) {
      setIsAutoSolving(false);
      setGameComplete(true); // Mark the game as complete when auto-solve finishes
    }
  }, [isAutoSolving, autoSolveIndex, autoSolveMoves, towers]); // Added towers to dependencies to ensure it re-runs after state updates

  // Check if the game is complete
  useEffect(() => {
    // Game is complete when all disks are on the last tower
    if (towers[2].length === disks && moves > 0) {
      setGameComplete(true);
      
      // Save game result to database
      if (playerName) {
        saveGameResult();
      }
    }
  }, [towers]);

  const resetGame = () => {
    // Create array of disks [n, n-1, ..., 1] for the first tower
    const firstTower = Array.from({ length: disks }, (_, i) => disks - i);
    setTowers([firstTower, [], []]);
    setMoves(0);
    setSelectedDisk(null);
    setGameComplete(false);
    setAutoSolveMoves([]);
    setAutoSolveIndex(0);
    setIsAutoSolving(false);
    setExecutionTime(0);
    // Calculate minimum moves required: 2^n - 1
    setMinMoves(Math.pow(2, disks) - 1);
  };

  const handleDiskSelect = (towerIndex) => {
    // If a tower is already selected, try to move to the new tower
    if (selectedDisk !== null) {
      moveDisk(selectedDisk, towerIndex);
      setSelectedDisk(null);
    } else {
      // If no disk is selected and the tower has disks, select the top disk
      if (towers[towerIndex].length > 0) {
        setSelectedDisk(towerIndex);
      }
    }
  };

  const moveDisk = (fromTower, toTower, isAutoMove = false) => {
    // Validate move
    if (fromTower === toTower) {
      return false; // Return false for invalid move
    }

    const sourceTower = [...towers[fromTower]];
    const targetTower = [...towers[toTower]];

    if (sourceTower.length === 0) {
      return false; // Return false for invalid move
    }

    // Get the topmost disk (last element in the array)
    const diskToMove = sourceTower[sourceTower.length - 1];
    
    // Check if move is valid (smaller disk onto larger disk or empty rod)
    if (targetTower.length > 0 && targetTower[targetTower.length - 1] < diskToMove) {
      return false; // Return false for invalid move
    }

    // Make the move - remove from source and add to target
    sourceTower.pop(); // Remove the last element
    targetTower.push(diskToMove); // Add to end of target tower

    // Update towers state
    const newTowers = [...towers];
    newTowers[fromTower] = sourceTower;
    newTowers[toTower] = targetTower;
    
    setTowers(newTowers);
    if (!isAutoMove) {
      setMoves(moves + 1);
    }
    
    return true; // Return true for successful move
  };

  const fetchSolution = async () => {
    if (isAutoSolving) return;

    try {
      // Start loading state
      setIsAutoSolving(true); 
      
      const response = await axios.get('/api/tower-of-hanoi/solution', {
        params: {
          algorithm,
          disks
        }
      });

      if (response.data && Array.isArray(response.data.moves)) {
        setExecutionTime(response.data.executionTime || 0);
        setAutoSolveMoves(response.data.moves);
        
        // Reset the game and prepare for auto-solve animation
        resetGame();
        setAutoSolveIndex(0);
        
        console.log(`Auto-solve started: ${response.data.moves.length} moves to animate`);
      } else {
        throw new Error('Invalid response format - moves array not found');
      }

    } catch (error) {
      console.error('Error fetching solution:', error);
      setIsAutoSolving(false);
      alert('Failed to fetch solution. Please try again.');
    }
  };

  const saveGameResult = async () => {
    try {
      await axios.post('/api/tower-of-hanoi/results', {
        playerName,
        disks,
        moves,
        optimalMoves: minMoves,
        timeTaken: Date.now(), // You could add a timer for actual time taken
        algorithm: 'player'
      });
      console.log('Game result saved!');
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const stopAutoSolve = () => {
    setIsAutoSolving(false);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-between overflow-auto">
      <GameBackground />
      <div className="flex-1 flex flex-col py-4 px-4 md:px-6 max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-center
                       bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Tower of Hanoi
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-1 mb-3"></div>
        </div>

        {/* Main content */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center lg:items-start overflow-auto">
          {/* Game area */}
          <div className="lg:flex-1 flex flex-col items-center">
            {/* Auto-solve controls */}
            <div className="w-full flex flex-wrap justify-center gap-3 mb-4">
              <button
                onClick={() => setAlgorithm('recursive')}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  algorithm === 'recursive'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                disabled={isAutoSolving}
              >
                Recursive Algorithm
              </button>
              <button
                onClick={() => setAlgorithm('iterative')}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  algorithm === 'iterative'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                disabled={isAutoSolving}
              >
                Iterative Algorithm
              </button>
              <button
                onClick={fetchSolution}
                disabled={isAutoSolving}
                className={`px-3 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Auto Solve
              </button>
              {isAutoSolving && (
                <button
                  onClick={stopAutoSolve}
                  className="px-3 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  Stop
                </button>
              )}
            </div>

            {/* Towers */}
            <HanoiTower 
              towers={towers} 
              onTowerClick={handleDiskSelect} 
              selectedTower={selectedDisk}
              disks={disks} 
              gameComplete={gameComplete}
            />

            {/* Game controls */}
            <TowerControls
              disks={disks}
              setDisks={setDisks}
              resetGame={resetGame}
              isAutoSolving={isAutoSolving}
              navigate={navigate}
            />

            {/* Game stats */}
            <div className="mt-3 w-full max-w-md bg-gray-800/80 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Current Moves</p>
                  <p className="text-white text-lg font-semibold">{moves}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Optimal Moves</p>
                  <p className="text-white text-lg font-semibold">{minMoves}</p>
                </div>
                {executionTime > 0 && (
                  <div className="text-center col-span-2">
                    <p className="text-gray-400 text-xs">Algorithm Execution Time</p>
                    <p className="text-white text-lg font-semibold">
                      {executionTime.toFixed(2)} ms
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-64 flex flex-col lg:max-h-full lg:overflow-auto">
            <HanoiPlayerInfo 
              playerName={playerName} 
              setPlayerName={setPlayerName} 
              moves={moves}
              minMoves={minMoves}
              gameComplete={gameComplete}
            />
            <HanoiInstructions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TowerOfHanoi;
