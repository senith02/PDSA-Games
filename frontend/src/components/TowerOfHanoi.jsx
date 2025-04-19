import { useState, useEffect, useRef } from 'react';

function TowerOfHanoi({ onBack }) {
  const [numDisks, setNumDisks] = useState(0);
  const [moves, setMoves] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pegs, setPegs] = useState([[], [], []]);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [algorithm, setAlgorithm] = useState('recursive'); // Default algorithm
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [pegCount, setPegCount] = useState(3); // Default is 3 pegs

  // Animation refs
  const animationRef = useRef(null);
  
  // Initialize game with random number of disks
  useEffect(() => {
    const randomDisks = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    setNumDisks(randomDisks);
    
    // Initialize the first peg with all disks
    const initialPegs = [
      Array.from({ length: randomDisks }, (_, i) => randomDisks - i),
      [],
      []
    ];
    
    if (pegCount === 4) {
      initialPegs.push([]); // Add a 4th peg if needed
    }
    
    setPegs(initialPegs);
    setStartTime(performance.now());
    
    // Generate solution
    generateSolution(randomDisks, algorithm, pegCount);
  }, [algorithm, pegCount]);
  
  // Track moves and check for completion
  useEffect(() => {
    // Check if the game is complete (all disks moved to the last peg)
    if (pegs[pegs.length - 1].length === numDisks) {
      const endTime = performance.now();
      setTimeTaken(endTime - startTime);
      setGameCompleted(true);
    }
  }, [pegs, numDisks, startTime]);
  
  // Generate solution based on selected algorithm
  const generateSolution = (disks, algo, pegCount) => {
    const solutionMoves = [];
    
    if (algo === 'recursive') {
      // Recursive solution
      const solveRecursive = (n, source, auxiliary, destination) => {
        if (n === 1) {
          solutionMoves.push(`Move disk 1 from ${source} to ${destination}`);
          return;
        }
        solveRecursive(n - 1, source, destination, auxiliary);
        solutionMoves.push(`Move disk ${n} from ${source} to ${destination}`);
        solveRecursive(n - 1, auxiliary, source, destination);
      };
      
      solveRecursive(disks, 'A', 'B', 'C');
    } else if (algo === 'iterative') {
      // Iterative solution
      const totalMoves = Math.pow(2, disks) - 1;
      for (let i = 1; i <= totalMoves; i++) {
        // Complex bit manipulation to determine disk and peg
        const disk = (pegCount === 3) 
          ? 1 + ((i & -i) === i ? 0 : 32 - Math.clz32(i & -i ^ i))
          : Math.min(disks, Math.round(Math.log2(i)));
          
        let from, to;
        if (pegCount === 3) {
          // Classic 3-peg solution
          const remainder = i % 3;
          from = ['A', 'C', 'A', 'B'][remainder];
          to = ['C', 'B', 'B', 'C'][remainder];
        } else {
          // Frame-Stewart algorithm for 4-pegs (simplified)
          from = ['A', 'B', 'C', 'D'][i % 4];
          to = ['B', 'C', 'D', 'A'][(i + (disk % 2)) % 4];
        }
        
        solutionMoves.push(`Move disk ${disk} from ${from} to ${to}`);
      }
    } else if (algo === 'frameStewart') {
      // Frame-Stewart algorithm for 4-pegs
      const solve4Pegs = (n, source, aux1, aux2, dest) => {
        if (n === 0) return;
        if (n === 1) {
          solutionMoves.push(`Move disk 1 from ${source} to ${dest}`);
          return;
        }
        
        // k is determined using sqrt(2n + 1) - 1
        const k = Math.floor(Math.sqrt(2 * n + 1) - 1);
        
        // Move top k disks to aux1
        solve4Pegs(k, source, aux2, dest, aux1);
        
        // Move remaining disks to dest using classic 3-peg approach
        const solveRecursive = (n, s, a, d) => {
          if (n === 1) {
            solutionMoves.push(`Move disk ${n} from ${s} to ${d}`);
            return;
          }
          solveRecursive(n - 1, s, d, a);
          solutionMoves.push(`Move disk ${n} from ${s} to ${d}`);
          solveRecursive(n - 1, a, s, d);
        };
        solveRecursive(n - k, source, aux2, dest);
        
        // Move k disks from aux1 to dest
        solve4Pegs(k, aux1, source, aux2, dest);
      };
      
      solve4Pegs(disks, 'A', 'B', 'C', 'D');
    }
    
    setSolution(solutionMoves);
  };

  // Handle disk selection
  const handleDiskSelect = (pegIndex, diskIndex) => {
    if (gameCompleted) return;
    
    // Can only select the top disk
    if (diskIndex !== pegs[pegIndex].length - 1) return;
    
    const disk = pegs[pegIndex][diskIndex];
    setSelectedDisk({ disk, fromPeg: pegIndex });
  };
  
  // Handle disk placement
  const handlePegSelect = (pegIndex) => {
    if (!selectedDisk || gameCompleted) return;
    
    const { disk, fromPeg } = selectedDisk;
    
    // Can't place on the same peg
    if (fromPeg === pegIndex) {
      setSelectedDisk(null);
      return;
    }
    
    const targetPeg = pegs[pegIndex];
    
    // Check if move is valid (smaller disk on top of larger disk)
    if (targetPeg.length === 0 || disk < targetPeg[targetPeg.length - 1]) {
      // Record the move
      setMoves([...moves, `Move disk ${disk} from ${String.fromCharCode(65 + fromPeg)} to ${String.fromCharCode(65 + pegIndex)}`]);
      
      // Update pegs
      const newPegs = [...pegs];
      newPegs[fromPeg] = newPegs[fromPeg].slice(0, -1);
      newPegs[pegIndex] = [...newPegs[pegIndex], disk];
      setPegs(newPegs);
    }
    
    setSelectedDisk(null);
  };
  
  // Show next solution move with animation
  const showNextSolutionMove = () => {
    if (solutionIndex >= solution.length) return;
    
    const move = solution[solutionIndex];
    const match = move.match(/Move disk (\d+) from ([A-D]) to ([A-D])/);
    
    if (match) {
      const [_, diskSize, fromPegChar, toPegChar] = match;
      const fromPegIndex = fromPegChar.charCodeAt(0) - 65;
      const toPegIndex = toPegChar.charCodeAt(0) - 65;
      
      // Update pegs
      const newPegs = [...pegs];
      const disk = newPegs[fromPegIndex].pop();
      newPegs[toPegIndex].push(disk);
      setPegs(newPegs);
      
      // Record the move
      setMoves([...moves, move]);
    }
    
    setSolutionIndex(solutionIndex + 1);
  };
  
  // Reset the game
  const resetGame = () => {
    const randomDisks = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    setNumDisks(randomDisks);
    
    // Initialize the first peg with all disks
    const initialPegs = [
      Array.from({ length: randomDisks }, (_, i) => randomDisks - i),
      [],
      []
    ];
    
    if (pegCount === 4) {
      initialPegs.push([]); // Add a 4th peg if needed
    }
    
    setPegs(initialPegs);
    setMoves([]);
    setStartTime(performance.now());
    setGameCompleted(false);
    setTimeTaken(0);
    setSubmitMessage('');
    setSolutionIndex(0);
    setShowSolution(false);
    
    // Generate solution
    generateSolution(randomDisks, algorithm, pegCount);
  };

  // Submit results
  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setSubmitMessage('Please enter your name');
      return;
    }
    
    if (!gameCompleted) {
      setSubmitMessage('Please complete the puzzle first');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Save result to the backend
      const response = await fetch('http://localhost:5000/api/towerOfHanoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          playerName, 
          numDisks, 
          moves, 
          timeTaken,
          algorithm,
          pegCount
        }),
      });

      if (response.ok) {
        setSubmitMessage('Results submitted successfully!');
      } else {
        setSubmitMessage('Failed to submit results. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      setSubmitMessage('Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change algorithm and reset
  const changeAlgorithm = (algo) => {
    setAlgorithm(algo);
    resetGame();
  };
  
  // Change peg count and reset
  const changePegCount = (count) => {
    setPegCount(count);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
          >
            <span className="mr-2">←</span> Back to Menu
          </button>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Tower of Hanoi
          </h1>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => changeAlgorithm('recursive')}
              className={`px-3 py-1 rounded ${algorithm === 'recursive' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Recursive
            </button>
            <button 
              onClick={() => changeAlgorithm('iterative')}
              className={`px-3 py-1 rounded ${algorithm === 'iterative' 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Iterative
            </button>
            {pegCount === 4 && (
              <button 
                onClick={() => changeAlgorithm('frameStewart')}
                className={`px-3 py-1 rounded ${algorithm === 'frameStewart' 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Frame-Stewart
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-4 flex justify-center space-x-4">
          <button 
            onClick={() => changePegCount(3)}
            className={`px-4 py-2 rounded ${pegCount === 3 
              ? 'bg-purple-600' 
              : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            3 Pegs
          </button>
          <button 
            onClick={() => changePegCount(4)}
            className={`px-4 py-2 rounded ${pegCount === 4 
              ? 'bg-purple-600' 
              : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            4 Pegs
          </button>
        </div>
        
        <div className="mb-6 bg-gray-800/80 p-4 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div>
              <p className="text-gray-300">Number of Disks: <span className="font-semibold text-blue-400">{numDisks}</span></p>
              <p className="text-sm text-gray-400">
                Move all disks from the leftmost peg to the rightmost peg.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button 
                onClick={resetGame}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Reset Game
              </button>
              {!showSolution && (
                <button 
                  onClick={() => setShowSolution(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Show Solution
                </button>
              )}
              {showSolution && (
                <button 
                  onClick={showNextSolutionMove}
                  disabled={solutionIndex >= solution.length}
                  className={`px-4 py-2 text-white rounded transition-colors ${
                    solutionIndex >= solution.length 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Next Move
                </button>
              )}
            </div>
          </div>
          
          {/* Tower of Hanoi Visualization */}
          <div className="relative h-80 flex justify-around items-end">
            {pegs.map((peg, pegIndex) => (
              <div 
                key={pegIndex}
                onClick={() => handlePegSelect(pegIndex)}
                className={`relative w-4 h-64 bg-gray-600 rounded-t-lg cursor-pointer
                  ${selectedDisk ? 'hover:bg-gray-500' : ''}
                  ${selectedDisk && selectedDisk.fromPeg === pegIndex ? 'bg-blue-600' : ''}`}
                style={{ marginBottom: '1rem' }}
              >
                {/* Base of the peg */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-700 rounded"></div>
                
                {/* Disks on the peg */}
                {peg.map((diskSize, diskIndex) => (
                  <div
                    key={diskIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDiskSelect(pegIndex, diskIndex);
                    }}
                    className={`absolute left-1/2 transform -translate-x-1/2 h-6 rounded-md
                      ${diskIndex === peg.length - 1 && !gameCompleted ? 'cursor-grab hover:opacity-80' : 'cursor-default'}
                      ${selectedDisk && selectedDisk.disk === diskSize && selectedDisk.fromPeg === pegIndex ? 'ring-2 ring-white' : ''}`}
                    style={{
                      width: `${(diskSize * 16) + 16}px`,
                      bottom: `${diskIndex * 28}px`,
                      backgroundColor: `hsl(${(diskSize * 25) % 360}, 70%, 50%)`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      {diskSize}
                    </span>
                  </div>
                ))}
                
                {/* Peg Letter */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                  {String.fromCharCode(65 + pegIndex)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Player Info & Submission */}
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Player Information</h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Player Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {submitMessage && (
              <div className={`p-3 rounded-lg mb-4 ${submitMessage.includes('successfully') ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>
                {submitMessage}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">
                  Time: <span className="text-blue-400">{(timeTaken / 1000).toFixed(2)}s</span>
                </p>
                <p className="text-gray-400">
                  Moves: <span className="text-blue-400">{moves.length}</span>
                </p>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !gameCompleted}
                className={`px-6 py-3 rounded-lg font-bold ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-wait' 
                    : !gameCompleted
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Result'}
              </button>
            </div>
            
            {!gameCompleted && (
              <p className="mt-4 text-sm text-amber-400">
                Complete the puzzle to submit your result
              </p>
            )}
          </div>
          
          {/* Right Column - Moves & Solution */}
          <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Your Moves</h2>
            
            <div className="h-64 overflow-y-auto bg-gray-900/50 p-4 rounded-lg">
              {moves.length === 0 ? (
                <p className="text-gray-500 italic">No moves yet. Start by dragging a disk.</p>
              ) : (
                <ol className="list-decimal pl-6">
                  {moves.map((move, index) => (
                    <li key={index} className="text-gray-300 mb-1">{move}</li>
                  ))}
                </ol>
              )}
            </div>
            
            <div className="mt-4">
              {gameCompleted ? (
                <div className="p-3 bg-green-800/30 text-green-300 rounded-lg">
                  Puzzle completed in {moves.length} moves! The minimum required is {Math.pow(2, numDisks) - 1}.
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Minimum possible moves: {Math.pow(2, numDisks) - 1}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TowerOfHanoi;
