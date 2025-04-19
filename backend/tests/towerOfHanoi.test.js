import { towerOfHanoiRecursive, towerOfHanoiFrameStewart } from '../algorithms/towerOfHanoi/recursive.js';
import { towerOfHanoiIterative } from '../algorithms/towerOfHanoi/iterative.js';

// Test recursive solution
test('Tower of Hanoi Recursive - Move Count', () => {
  const moves = towerOfHanoiRecursive(3, 'A', 'B', 'C');
  expect(moves.length).toBe(7); // 2^3 - 1 = 7 moves
});

// Test iterative solution
test('Tower of Hanoi Iterative - Move Count', () => {
  const moves = towerOfHanoiIterative(3, 'A', 'B', 'C');
  expect(moves.length).toBe(7); // 2^3 - 1 = 7 moves
});

// Test Frame-Stewart algorithm (4-peg)
test('Tower of Hanoi Frame-Stewart (4-peg)', () => {
  const moves = towerOfHanoiFrameStewart(3, 'A', 'B', 'C', 'D');
  // For n=3, Frame-Stewart should use fewer moves than standard 3-peg
  expect(moves.length).toBeLessThanOrEqual(7);
});

// Test that both solutions produce valid results for larger disk counts
test('Solutions Scale Properly', () => {
  for (let n = 1; n <= 5; n++) {
    const recursiveMoves = towerOfHanoiRecursive(n, 'A', 'B', 'C');
    const iterativeMoves = towerOfHanoiIterative(n, 'A', 'B', 'C');
    const expectedMoves = Math.pow(2, n) - 1;
    
    expect(recursiveMoves.length).toBe(expectedMoves);
    expect(iterativeMoves.length).toBe(expectedMoves);
  }
});

// Test performance comparison between 3-peg and 4-peg solutions
test('4-peg Frame-Stewart vs 3-peg Comparison', () => {
  const n = 6; // Large enough to show difference
  const threePegMoves = towerOfHanoiRecursive(n, 'A', 'B', 'C');
  const fourPegMoves = towerOfHanoiFrameStewart(n, 'A', 'B', 'C', 'D');
  
  // 4-peg should be more efficient than 3-peg
  expect(fourPegMoves.length).toBeLessThan(threePegMoves.length);
});
