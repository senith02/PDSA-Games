/**
 * Tower of Hanoi - Recursive Algorithm Implementation
 */

/**
 * Solve the Tower of Hanoi puzzle using recursion
 * @param {number} n - Number of disks
 * @param {number} source - Source tower (0 for A)
 * @param {number} auxiliary - Auxiliary tower (1 for B)
 * @param {number} target - Target tower (2 for C)
 * @returns {Array} Array of moves, each move is [from, to]
 */
function solveRecursively(n, source = 0, auxiliary = 1, target = 2) {
  const moves = [];
  
  // Performance measurement
  const startTime = performance.now();
  
  /**
   * Helper function that recursively solves Tower of Hanoi
   * @param {number} disks - Number of disks to move
   * @param {number} from - Source tower
   * @param {number} aux - Auxiliary tower
   * @param {number} to - Target tower
   */
  function hanoi(disks, from, aux, to) {
    if (disks === 1) {
      // Base case: Move one disk directly from source to target
      moves.push([from, to]);
    } else {
      // Recursive case:
      // 1. Move n-1 disks from source to auxiliary
      hanoi(disks - 1, from, to, aux);
      // 2. Move the largest disk from source to target
      moves.push([from, to]);
      // 3. Move n-1 disks from auxiliary to target
      hanoi(disks - 1, aux, from, to);
    }
  }
  
  // Start solving the puzzle
  hanoi(n, source, auxiliary, target);
  
  const endTime = performance.now();
  
  return {
    moves,
    executionTime: endTime - startTime,
    steps: Math.pow(2, n) - 1 // Formula for minimum number of moves
  };
}

module.exports = { solveRecursively };
