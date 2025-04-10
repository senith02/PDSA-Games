/**
 * Knight's Tour algorithm implementations
 * Provides both backtracking and Warnsdorff's heuristic solutions
 */

// The 8 possible moves a knight can make
const knightMoves = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
];

/**
 * Solve Knight's Tour using backtracking algorithm
 * @param {number} startRow - Starting row position (0-7)
 * @param {number} startCol - Starting column position (0-7)
 * @returns {Array} 2D array where each cell contains the move sequence number (-1 if not visited)
 */
function solveUsingBacktracking(startRow, startCol) {
  // Create solution board (all -1 initially)
  const solution = Array(8).fill().map(() => Array(8).fill(-1));
  solution[startRow][startCol] = 0;  // Mark starting position
  
  const solveUtil = (row, col, moveCount) => {
    // Base case: If all squares are visited, we found a solution
    if (moveCount === 64) {
      return true;
    }
    
    // Try all 8 possible moves from current position
    for (const [dx, dy] of knightMoves) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      // Check if the move is valid (on board and not visited)
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && solution[newRow][newCol] === -1) {
        // Make the move
        solution[newRow][newCol] = moveCount;
        
        // Recursively try to solve from this new position
        if (solveUtil(newRow, newCol, moveCount + 1)) {
          return true;
        }
        
        // If this move doesn't lead to a solution, backtrack
        solution[newRow][newCol] = -1;
      }
    }
    
    // If no move leads to a solution
    return false;
  };
  
  // Start the recursive solving process
  const startTime = performance.now();
  solveUtil(startRow, startCol, 1);
  const endTime = performance.now();
  
  return {
    solution,
    executionTime: endTime - startTime
  };
}

/**
 * Solve Knight's Tour using Warnsdorff's heuristic algorithm
 * @param {number} startRow - Starting row position (0-7)
 * @param {number} startCol - Starting column position (0-7)
 * @returns {Array} 2D array where each cell contains the move sequence number (-1 if not visited)
 */
function solveUsingWarnsdorff(startRow, startCol) {
  // Create solution board
  const solution = Array(8).fill().map(() => Array(8).fill(-1));
  solution[startRow][startCol] = 0;  // Mark starting position
  
  let curRow = startRow;
  let curCol = startCol;
  
  // Helper to count available moves from a position
  const countAvailableMoves = (row, col, visited) => {
    let count = 0;
    for (const [dx, dy] of knightMoves) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && visited[newRow][newCol] === -1) {
        count++;
      }
    }
    return count;
  };
  
  const startTime = performance.now();
  
  // Fill the board using Warnsdorff's rule
  for (let moveCount = 1; moveCount < 64; moveCount++) {
    let nextRow = -1;
    let nextCol = -1;
    let minDegree = 9; // More than maximum possible degree (8)
    
    // Try all 8 possible moves
    for (const [dx, dy] of knightMoves) {
      const newRow = curRow + dx;
      const newCol = curCol + dy;
      
      // Check if move is valid and not visited
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && solution[newRow][newCol] === -1) {
        // Count degree (number of available next moves)
        const degree = countAvailableMoves(newRow, newCol, solution);
        
        // Update if this move has fewer next moves (Warnsdorff's rule)
        if (degree < minDegree) {
          minDegree = degree;
          nextRow = newRow;
          nextCol = newCol;
        }
      }
    }
    
    // If we can't move further
    if (nextRow === -1) {
      break; // Return partial solution
    }
    
    // Make the move with minimum degree
    solution[nextRow][nextCol] = moveCount;
    curRow = nextRow;
    curCol = nextCol;
  }
  
  const endTime = performance.now();
  
  return {
    solution,
    executionTime: endTime - startTime
  };
}

// Test the algorithms
console.log("Testing Knight's Tour algorithms...");

// Random starting position for testing
const testRow = Math.floor(Math.random() * 8);
const testCol = Math.floor(Math.random() * 8);

console.log(`Starting position: (${testRow}, ${testCol})`);

// Test backtracking algorithm
const backtrackingStart = performance.now();
const backtrackingResult = solveUsingBacktracking(testRow, testCol);
const backtrackingEnd = performance.now();
console.log(`Backtracking solution found in ${backtrackingResult.executionTime.toFixed(2)} ms`);

// Test Warnsdorff's algorithm
const warnsdorffStart = performance.now();
const warnsdorffResult = solveUsingWarnsdorff(testRow, testCol);
const warnsdorffEnd = performance.now();
console.log(`Warnsdorff's solution found in ${warnsdorffResult.executionTime.toFixed(2)} ms`);

// Export the functions
module.exports = {
  solveUsingBacktracking,
  solveUsingWarnsdorff
};