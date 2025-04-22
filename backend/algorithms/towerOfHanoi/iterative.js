export const towerOfHanoiIterative = (n, source, auxiliary, destination) => {
  const moves = [];
  const totalMoves = Math.pow(2, n) - 1;
  
  // For odd n, the smallest disk moves source → destination → auxiliary → source...
  // For even n, the smallest disk moves source → auxiliary → destination → source...
  for (let move = 1; move <= totalMoves; move++) {
    // Determine which disk to move (the largest bit position in binary representation)
    let disk = 1;
    let temp = move;
    while (temp % 2 === 0) {
      disk++;
      temp = Math.floor(temp / 2);
    }
    
    if (n % 2 === 1) {
      // For odd number of disks
      if (disk % 2 === 1) {
        moves.push(`Move disk ${disk} from ${source} to ${destination}`);
      } else if (disk % 2 === 0) {
        moves.push(`Move disk ${disk} from ${source} to ${auxiliary}`);
      }
    } else {
      // For even number of disks
      if (disk % 2 === 1) {
        moves.push(`Move disk ${disk} from ${source} to ${auxiliary}`);
      } else if (disk % 2 === 0) {
        moves.push(`Move disk ${disk} from ${source} to ${destination}`);
      }
    }
  }
  
  return moves;
};
