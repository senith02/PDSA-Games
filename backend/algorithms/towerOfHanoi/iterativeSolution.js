/**
 * Tower of Hanoi - Iterative Algorithm Implementation
 */

/**
 * Solve the Tower of Hanoi puzzle using an iterative approach
 * @param {number} n - Number of disks
 * @param {number} source - Source tower (0 for A)
 * @param {number} auxiliary - Auxiliary tower (1 for B)
 * @param {number} target - Target tower (2 for C)
 * @returns {Array} Array of moves, each move is [from, to]
 */
function solveIteratively(n, source = 0, auxiliary = 1, target = 2) {
  const moves = [];
  
  // Performance measurement
  const startTime = performance.now();
  
  // If number of disks is even, swap the auxiliary and target pegs
  if (n % 2 === 0) {
    [auxiliary, target] = [target, auxiliary];
  }
  
  // Total number of moves required
  const totalMoves = Math.pow(2, n) - 1;
  
  // Create towers array to track disk positions
  // Each tower is an array of disk sizes (larger number = larger disk)
  const towers = [
    Array.from({ length: n }, (_, i) => n - i), // Source tower with all disks
    [], // Auxiliary tower (empty)
    []  // Target tower (empty)
  ];
  
  for (let move = 1; move <= totalMoves; move++) {
    let fromTower, toTower;
    
    if (move % 3 === 1) {
      // Move between source and target
      if (towers[source].length > 0 && 
         (towers[target].length === 0 || towers[source][towers[source].length - 1] < towers[target][towers[target].length - 1])) {
        fromTower = source;
        toTower = target;
      } else {
        fromTower = target;
        toTower = source;
      }
    } else if (move % 3 === 2) {
      // Move between source and auxiliary
      if (towers[source].length > 0 && 
         (towers[auxiliary].length === 0 || towers[source][towers[source].length - 1] < towers[auxiliary][towers[auxiliary].length - 1])) {
        fromTower = source;
        toTower = auxiliary;
      } else {
        fromTower = auxiliary;
        toTower = source;
      }
    } else {
      // Move between auxiliary and target
      if (towers[auxiliary].length > 0 && 
         (towers[target].length === 0 || towers[auxiliary][towers[auxiliary].length - 1] < towers[target][towers[target].length - 1])) {
        fromTower = auxiliary;
        toTower = target;
      } else {
        fromTower = target;
        toTower = auxiliary;
      }
    }
    
    // Make the move - get from the last element (top disk)
    const disk = towers[fromTower].pop();
    towers[toTower].push(disk);
    
    // Record the move
    moves.push([fromTower, toTower]);
  }
  
  const endTime = performance.now();
  
  return {
    moves,
    executionTime: endTime - startTime,
    steps: totalMoves // Formula for minimum number of moves
  };
}

module.exports = { solveIteratively };
