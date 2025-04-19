import { towerOfHanoiRecursive } from '../algorithms/towerOfHanoi/recursive.js';
import { towerOfHanoiIterative } from '../algorithms/towerOfHanoi/iterative.js';

test('Tower of Hanoi Recursive', () => {
  const consoleSpy = jest.spyOn(console, 'log');
  towerOfHanoiRecursive(3, 'A', 'B', 'C');
  expect(consoleSpy).toHaveBeenCalledTimes(7);
  consoleSpy.mockRestore();
});

test('Tower of Hanoi Iterative', () => {
  const moves = towerOfHanoiIterative(3, 'A', 'B', 'C');
  expect(moves.length).toBe(7);
});
