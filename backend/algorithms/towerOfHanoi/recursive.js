export const towerOfHanoiRecursive = (n, source, auxiliary, destination) => {
  if (n === 1) {
    console.log(`Move disk 1 from ${source} to ${destination}`);
    return;
  }
  towerOfHanoiRecursive(n - 1, source, destination, auxiliary);
  console.log(`Move disk ${n} from ${source} to ${destination}`);
  towerOfHanoiRecursive(n - 1, auxiliary, source, destination);
};
