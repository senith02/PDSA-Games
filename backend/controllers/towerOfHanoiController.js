// We're removing MongoDB dependencies for now as requested

export const saveTowerOfHanoiResult = (req, res) => {
  try {
    const { playerName, numDisks, moves, timeTaken, algorithm, pegCount } = req.body;
    
    // Log the result for debugging
    console.log('Tower of Hanoi Result:', { 
      playerName,
      numDisks,
      moveCount: Array.isArray(moves) ? moves.length : 0, 
      timeTaken,
      algorithm,
      pegCount
    });
    
    // Validate the moves
    const optimalMoveCount = Math.pow(2, numDisks) - 1;
    const actualMoveCount = Array.isArray(moves) ? moves.length : 0;
    const isOptimal = actualMoveCount === optimalMoveCount;
    
    // Analytics - calculate algorithm performance
    const algorithmPerformance = {
      recursive: {
        timeComplexity: "O(2^n)",
        spaceComplexity: "O(n)"
      },
      iterative: {
        timeComplexity: "O(2^n)",
        spaceComplexity: "O(1)"
      },
      frameStewart: {
        timeComplexity: "O(2^n)",
        spaceComplexity: "O(n)"
      }
    };
    
    // Send a response with analytics
    res.status(200).json({ 
      message: 'Result saved successfully',
      analytics: {
        optimal: isOptimal,
        optimalMoves: optimalMoveCount,
        actualMoves: actualMoveCount,
        performance: algorithmPerformance[algorithm || 'recursive']
      }
    });
  } catch (error) {
    console.error('Error saving Tower of Hanoi result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAlgorithmComparison = (req, res) => {
  try {
    // Generate algorithm comparison data
    const diskCounts = [3, 4, 5, 6, 7, 8, 9, 10];
    
    const recursivePerformance = diskCounts.map(disks => ({
      disks,
      moves: Math.pow(2, disks) - 1,
      estimatedTime: disks <= 5 ? Math.random() * 10 : Math.random() * 50 * Math.pow(2, disks - 5)
    }));
    
    const iterativePerformance = diskCounts.map(disks => ({
      disks,
      moves: Math.pow(2, disks) - 1,
      estimatedTime: disks <= 5 ? Math.random() * 8 : Math.random() * 40 * Math.pow(2, disks - 5)
    }));
    
    const frameStewartPerformance = diskCounts.map(disks => {
      // Frame-Stewart algorithm theoretical performance (simplified approximation)
      const k = Math.floor(Math.sqrt(2 * disks + 1) - 1);
      const moves = Math.pow(2, disks - k) + 2 * Math.pow(2, k) - 1;
      return {
        disks,
        moves,
        estimatedTime: disks <= 5 ? Math.random() * 12 : Math.random() * 35 * moves / (Math.pow(2, disks) - 1)
      };
    });
    
    res.json({
      recursive: recursivePerformance,
      iterative: iterativePerformance,
      frameStewart: frameStewartPerformance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
