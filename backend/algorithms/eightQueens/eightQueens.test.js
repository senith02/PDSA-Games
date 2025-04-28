const { isSafe, eightQueens } = require('./logic'); // Import functions to test

// Test Suite for isSafe function
describe('isSafe Function', () => {
  test('Correctly identifies safe and unsafe placements', () => {
    const board = Array(8).fill(0).map(() => Array(8).fill(0));
    board[0][0] = 1; // Place a queen at (0, 0)

    // Unsafe placements
    expect(isSafe(board, 1, 1, 8)).toBe(false); // Same diagonal
    expect(isSafe(board, 1, 0, 8)).toBe(false); // Same column
    expect(isSafe(board, 0, 1, 8)).toBe(false); // Same row
    expect(isSafe(board, 4, 4, 8)).toBe(false); // Same diagonal (Corrected assertion)

    // Safe placement
    expect(isSafe(board, 1, 2, 8)).toBe(true);  // Should be safe relative to (0,0)
  });
});

// Test Suite for eightQueens function
describe('eightQueens Function', () => {
  test('Finds all solutions for 8x8 board', () => {
    const board = Array(8).fill(0).map(() => Array(8).fill(0));
    const solutions = [];
    eightQueens(board, 0, 8, solutions);

    expect(solutions.length).toBe(92); // There are 92 unique solutions
  });
});

// Additional test cases can be added here