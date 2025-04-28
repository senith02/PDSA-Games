/**
 * Tower of Hanoi - Four Tower Iterative Algorithm Implementation
 */

/**
 * Solve the Tower of Hanoi puzzle with 4 towers using an iterative approach
 * Note: This is a simplified version that doesn't find the optimal solution
 * for all cases, but demonstrates 4-tower movement
 * 
 * @param {number} n - Number of disks
 * @param {number} source - Source tower (0 for A)
 * @param {number} auxiliary1 - First auxiliary tower (1 for B)
 * @param {number} auxiliary2 - Second auxiliary tower (2 for C)
 * @param {number} target - Target tower (3 for D)
 * @returns {Object} Object containing moves array and other stats
 */
function solveFourTowerIteratively(n, source = 0, auxiliary1 = 1, auxiliary2 = 2, target = 3) {
  const moves = [];
  
  // Performance measurement
  const startTime = performance.now();
  
  // Create towers array to track disk positions
  const towers = [
    Array.from({ length: n }, (_, i) => n - i), // Source tower with all disks
    [], // Auxiliary tower 1 (empty)
    [], // Auxiliary tower 2 (empty)
    []  // Target tower (empty)
  ];
  
  // Split disks into two groups for a more efficient solution
  const splitPoint = Math.floor(Math.sqrt(n));
  
  // Move smaller disks to auxiliary tower 1
  for (let i = splitPoint; i > 0; i--) {
    moves.push([source, auxiliary1]);
    towers[source].pop();
    towers[auxiliary1].push(i);
  }
  
  // Move larger disks to target using the standard approach
  moveTower(n - splitPoint, source, auxiliary2, target);
  
  // Move smaller disks from auxiliary1 to target
  for (let i = splitPoint; i > 0; i--) {
    moves.push([auxiliary1, target]);
    towers[auxiliary1].pop();
    towers[target].push(i);
  }
  
  // Helper function to move disks between towers (simulating the standard 3-tower approach)
  function moveTower(diskCount, from, aux, to) {
    if (diskCount === 0) return;
    
    if (diskCount === 1) {
      moves.push([from, to]);
      const disk = towers[from].pop();
      towers[to].push(disk);
      return;
    }
    
    moveTower(diskCount - 1, from, to, aux);
    moves.push([from, to]);
    const disk = towers[from].pop();
    towers[to].push(disk);
    moveTower(diskCount - 1, aux, from, to);
  }
  
  const endTime = performance.now();
  
  return {
    moves,
    executionTime: endTime - startTime,
    steps: moves.length
  };
}

module.exports = { solveFourTowerIteratively };
