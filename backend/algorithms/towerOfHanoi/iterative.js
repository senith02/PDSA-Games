export const towerOfHanoiIterative = (n, source, auxiliary, destination) => {
  const moves = [];
  const totalMoves = Math.pow(2, n) - 1;

  for (let i = 1; i <= totalMoves; i++) {
    const from = (i & i - 1) % 3;
    const to = ((i | i - 1) + 1) % 3;
    moves.push(`Move disk from ${from} to ${to}`);
  }

  return moves;
};
