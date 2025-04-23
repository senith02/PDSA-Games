// Helper function to get empty cells
const getEmptyCells = (board) => {
    return board
      .map((cell, idx) => cell === null ? idx : null)
      .filter(val => val !== null);
  };
  
  // Immediate win/block checker
  const findWinningMove = (board, player) => {
    const emptyCells = getEmptyCells(board);
    
    for (let i = 0; i < emptyCells.length; i++) {
      const index = emptyCells[i];
      const newBoard = [...board];
      newBoard[index] = player;
      if (checkWin(newBoard, player)) {
        return index;
      }
    }
    return null;
  };
  
  // Win condition checker for 5x5 (5 in a row)
   
    const checkWin = (board, player) => {
    // Check rows   
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 1; col++) {
        const idx = row * 5 + col;
        if (
          board[idx] === player && 
          board[idx] === board[idx + 1] && 
          board[idx] === board[idx + 2] && 
          board[idx] === board[idx + 3] && 
          board[idx] === board[idx + 4]
        ) return true;
      }
    }


    // Check columns
   
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 1; row++) {
            const idx = row * 5 + col;
            if (
            board[idx] === player && 
            board[idx] === board[idx + 5] && 
            board[idx] === board[idx + 10] && 
            board[idx] === board[idx + 15] && 
            board[idx] === board[idx + 20]
            ) return true;
        }
        }

    // Check diagonals (top-left to bottom-right)
     
    for (let row = 0; row < 1; row++) {
        for (let col = 0; col < 1; col++) {
            const idx = row * 5 + col;
            if (
            board[idx] === player && 
            board[idx] === board[idx + 6] && 
            board[idx] === board[idx + 12] && 
            board[idx] === board[idx + 18] && 
            board[idx] === board[idx + 24]
            ) return true;
        }
    }

    // Check diagonals (top-right to bottom-left)
   
    for (let row = 0; row < 1; row++) {
        for (let col = 4; col > 3; col--) {
            const idx = row * 5 + col;
            if (
            board[idx] === player && 
            board[idx] === board[idx + 4] && 
            board[idx] === board[idx + 8] && 
            board[idx] === board[idx + 12] && 
            board[idx] === board[idx + 16]
            ) return true;
        }
    }
    return false;

    
  };
  
  // ======================
  // ALGORITHM IMPLEMENTATIONS
  // ======================
  
  // 1. Random Move (Fallback)
  export const getRandomMove = (board) => {
    const emptyCells = getEmptyCells(board);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };
  
  // 2. Heuristic AI (Priority: Win > Block > Center > Corners > Random)
  export const getHeuristicMove = (board) => {
    // Try to win immediately
    const winningMove = findWinningMove(board, '⭘');
    if (winningMove !== null) return winningMove;
  
    // Block human from winning
    const blockingMove = findWinningMove(board, '✕');
    if (blockingMove !== null) return blockingMove;
  
    // Strategic positions (center then corners)
    const priorityMap = [
      12, // Center
      0, 6, 4, 8, 20, 24, // Corners and edge centers
      ...getEmptyCells(board) // Fallback to all remaining
    ];
  
    for (let pos of priorityMap) {
      if (board[pos] === null) return pos;
    }
  
    return getRandomMove(board);
  };
  
  // 3. Minimax AI (Stub - To be implemented)
  export const getMinimaxMove = (board) => {
    // TODO: Implement proper Minimax with alpha-beta pruning
    console.log("Minimax AI selected - using heuristic fallback");
    return getHeuristicMove(board);
  };
  
  // Main AI selector
  export const getComputerMove = (board, algorithm = 'heuristic') => {
    const startTime = performance.now();
    let move;
    
    switch (algorithm) {
      case 'minimax':
        move = getMinimaxMove(board);
        break;
      case 'random':
        move = getRandomMove(board);
        break;
      case 'heuristic':
      default:
        move = getHeuristicMove(board);
    }
    
    const endTime = performance.now();
    return {
      move,
      timeTaken: endTime - startTime
    };
  };