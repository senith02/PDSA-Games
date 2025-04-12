function eightqueens(board, col, n, solutions){

    if(col >= n){
        solutions.push(board.map(row => [...row]));
        return false;
    }
    
    for(let row = 0; row<n; row++){

        //constraints
        if(isSafe(board, row, col, n)){
            board[row][col] = 1;

            //recursion, col
        if(eightqueens(board, col+1, n, solutions))
            return true;

        //backtrack
        board[row][col] =0;
        }
        
    }
    return false;
}

function isSafe(board, row, col, n){

    let i,j;
    for(i = 0; i<col; i++){
        if(board[row][i] == 1){
            return false;
        }
    }

    //upper left diagnal
    for(i=row, j= col; i>=0 && j>=0; i--, j--){
        if(board[i][j] == 1){
            return false;
        }
    }

    //lower half left diagnal
    for(i=row, j=col; i<n && j>=0; i++,j--){
        if(board[i][j] == 1){
            return false;
        }
    }
    return true;
}


const board = Array(8).fill(0).map(() => Array(8).fill(0));
const n = board.length;
const solutions = [];

const startTime = performance.now();

eightqueens(board, 0, n, solutions);

const endTime = performance.now();
const executionTime = endTime - startTime;

console.log(`Eight Queens Algorithm executed in ${executionTime.toFixed(2)} milliseconds`);
// Print all solutions
console.log(`Total Solutions Found: ${solutions.length}`);
solutions.forEach((solution, index) => {
    console.log(`Solution ${index + 1}:`);
    solution.forEach(row => console.log(row.join(' ')));
    console.log("\n");
});
