/**
 * Tower of Hanoi - Four Tower Recursive Algorithm Implementation
 * Using the Frame-Stewart algorithm
 */

/**
 * Solve the Tower of Hanoi puzzle with 4 towers using a recursive approach
 * @param {number} n - Number of disks
 * @param {number} source - Source tower (0 for A)
 * @param {number} auxiliary1 - First auxiliary tower (1 for B)
 * @param {number} auxiliary2 - Second auxiliary tower (2 for C)
 * @param {number} target - Target tower (3 for D)
 * @returns {Object} Object containing moves array and other stats
 */
function solveFourTowerRecursively(n, source = 0, auxiliary1 = 1, auxiliary2 = 2, target = 3) {
  const moves = [];
  
  // Performance measurement
  const startTime = performance.now();
  
  /**
   * Calculate the optimal number of disks to move in the first step
   * This is a heuristic approach - the exact formula is complex
   * @param {number} disks - Number of disks
   * @returns {number} Number of disks to move
   */
  function getOptimalSplit(disks) {
    // A simple heuristic for the Frame-Stewart algorithm
    return Math.floor(Math.sqrt(disks));
  }
  
  /**
   * Helper function that recursively solves Tower of Hanoi with 4 towers
   * @param {number} disks - Number of disks to move
   * @param {number} from - Source tower
   * @param {number} aux1 - First auxiliary tower
   * @param {number} aux2 - Second auxiliary tower
   * @param {number} to - Target tower
   */
  function fourTowerHanoi(disks, from, aux1, aux2, to) {
    if (disks === 0) {
      return;
    }
    
    if (disks === 1) {
      // Base case: Move one disk directly from source to target
      moves.push([from, to]);
      return;
    }
    
    // Calculate the number of disks to move in the first step
    const k = getOptimalSplit(disks);
    
    // 1. Move top n-k disks from source to auxiliary2 using all 4 towers
    fourTowerHanoi(disks - k, from, aux2, to, aux1);
    
    // 2. Move the remaining k disks from source to target using 3 towers
    threeTowerHanoi(k, from, aux2, to);
    
    // 3. Move n-k disks from auxiliary1 to target using all 4 towers
    fourTowerHanoi(disks - k, aux1, from, aux2, to);
  }
  
  /**
   * Standard 3-tower Hanoi solution (for sub-problems)
   * @param {number} disks - Number of disks to move
   * @param {number} from - Source tower
   * @param {number} aux - Auxiliary tower
   * @param {number} to - Target tower
   */
  function threeTowerHanoi(disks, from, aux, to) {
    if (disks === 1) {
      moves.push([from, to]);
      return;
    }
    
    threeTowerHanoi(disks - 1, from, to, aux);
    moves.push([from, to]);
    threeTowerHanoi(disks - 1, aux, from, to);
  }
  
  // Start solving the puzzle
  fourTowerHanoi(n, source, auxiliary1, auxiliary2, target);
  
  const endTime = performance.now();
  
  return {
    moves,
    executionTime: endTime - startTime,
    steps: moves.length // Actual number of moves
  };
}

module.exports = { solveFourTowerRecursively };
