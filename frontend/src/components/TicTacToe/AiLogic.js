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
    const n = 5; // Board size
    const lines = [];

    // Generate rows
    for (let i = 0; i < n; i++) {
      lines.push(Array.from({ length: n }, (_, k) => i * n + k));
    }
    // Generate columns
    for (let j = 0; j < n; j++) {
      lines.push(Array.from({ length: n }, (_, k) => k * n + j));
    }
    // Generate diagonals
    lines.push(Array.from({ length: n }, (_, k) => k * n + k)); // TL-BR
    lines.push(Array.from({ length: n }, (_, k) => k * n + (n - 1 - k))); // TR-BL

    // Check all lines
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (board[a] === player && board[b] === player && board[c] === player && board[d] === player && board[e] === player) {
        return true; // Found a win
      }
    }
    return false; // No win found
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