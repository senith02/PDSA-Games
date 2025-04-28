const { solveUsingBacktracking, solveUsingWarnsdorff } = require('../../algorithms/knightsTour');

describe("Knight's Tour Algorithm Tests", () => {
  test('solveUsingBacktracking produces a valid solution from starting position (0, 0)', () => {
    const startRow = 0;
    const startCol = 0;
    const result = solveUsingBacktracking(startRow, startCol);
    
    // Check if solution is returned
    expect(result).toBeDefined();
    expect(result.solution).not.toBeNull();
    expect(result.executionTime).toBeGreaterThan(0);
    
    // Check if solution has the correct size
    expect(result.solution.length).toBe(8);
    expect(result.solution[0].length).toBe(8);
    
    // Check if starting position is marked as 0
    expect(result.solution[startRow][startCol]).toBe(0);
    
    // Check if all squares are visited exactly once
    const allMoves = result.solution.flat();
    const uniqueMoves = new Set(allMoves);
    expect(uniqueMoves.size).toBe(64); // All 64 squares should be visited
    for (let i = 0; i < 64; i++) {
      expect(allMoves.includes(i)).toBe(true); // Each move number should be present
    }
  });
  
  test('solveUsingWarnsdorff finds solution faster than backtracking', () => {
    const startRow = 3;
    const startCol = 3;
    
    // Measure backtracking performance
    const backtrackingResult = solveUsingBacktracking(startRow, startCol);
    
    // Measure Warnsdorff performance
    const warnsdorffResult = solveUsingWarnsdorff(startRow, startCol);
    
    // Both should produce valid solutions
    expect(backtrackingResult.solution).not.toBeNull();
    expect(warnsdorffResult.solution).not.toBeNull();
    
    // Warnsdorff should generally be faster
    expect(warnsdorffResult.executionTime).toBeLessThan(backtrackingResult.executionTime);
    console.log(`Backtracking time: ${backtrackingResult.executionTime}ms`);
    console.log(`Warnsdorff time: ${warnsdorffResult.executionTime}ms`);
    console.log(`Speed improvement: ${(backtrackingResult.executionTime / warnsdorffResult.executionTime).toFixed(2)}x faster`);
  });
});