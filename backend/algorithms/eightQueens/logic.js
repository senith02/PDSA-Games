function eightQueens(board, col, n, solutions){

    if(col >= n){
        solutions.push(board.map(row => [...row]));
        return false;
    }
    
    for(let row = 0; row < n; row++){

        //constraints
        if(isSafe(board, row, col, n)){
            board[row][col] = 1;

            //recursion, col
        if(eightQueens(board, col+1, n, solutions))
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

module.exports = { eightQueens };