export const towerOfHanoiRecursive = (n, source, auxiliary, destination) => {
  const moves = [];
  
  const solve = (n, source, auxiliary, destination) => {
    if (n === 1) {
      moves.push(`Move disk 1 from ${source} to ${destination}`);
      return;
    }
    solve(n - 1, source, destination, auxiliary);
    moves.push(`Move disk ${n} from ${source} to ${destination}`);
    solve(n - 1, auxiliary, source, destination);
  };
  
  solve(n, source, auxiliary, destination);
  return moves;
};

// Solution for 4 pegs (Frame-Stewart algorithm)
export const towerOfHanoiFrameStewart = (n, source, aux1, aux2, destination) => {
  const moves = [];
  
  const solve4Pegs = (n, source, aux1, aux2, dest) => {
    if (n === 0) return;
    if (n === 1) {
      moves.push(`Move disk 1 from ${source} to ${dest}`);
      return;
    }
    
    // k is determined using sqrt(2n + 1) - 1
    const k = Math.floor(Math.sqrt(2 * n + 1) - 1);
    
    // Move top k disks to aux1
    solve4Pegs(k, source, aux2, dest, aux1);
    
    // Move remaining disks to dest using classic 3-peg approach
    const solveRecursive = (n, s, a, d) => {
      if (n === 1) {
        moves.push(`Move disk ${n} from ${s} to ${d}`);
        return;
      }
      solveRecursive(n - 1, s, d, a);
      moves.push(`Move disk ${n} from ${s} to ${d}`);
      solveRecursive(n - 1, a, s, d);
    };
    
    solveRecursive(n - k, source, aux2, dest);
    
    // Move k disks from aux1 to dest
    solve4Pegs(k, aux1, source, aux2, dest);
  };
  
  solve4Pegs(n, source, aux1, aux2, destination);
  return moves;
};
