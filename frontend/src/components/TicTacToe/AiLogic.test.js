const { checkWin, findWinningMove, getEmptyCells, getHeuristicMove, getMinimaxMove, getRandomMove, getComputerMove } = require('./AiLogic');

describe('getHeuristicMove Function', () => {
    test('Returns winning move when available', () => {
        // Create a board where O can win
        const winningBoard = Array(25).fill(null);
        winningBoard[0] = '⭘';
        winningBoard[1] = '⭘';
        winningBoard[2] = '⭘';
        winningBoard[3] = '⭘';
        // Position 4 is the winning move
        
        expect(getHeuristicMove(winningBoard)).toBe(4);
    });

    test('Blocks opponent winning move when no winning move is available', () => {
        // Create a board where X can win and needs to be blocked
        const blockingBoard = Array(25).fill(null);
        blockingBoard[5] = '✕';
        blockingBoard[6] = '✕';
        blockingBoard[7] = '✕';
        blockingBoard[8] = '✕';
        // Position 9 should be blocked
        
        expect(getHeuristicMove(blockingBoard)).toBe(9);
    });

    test('Prioritizes center when no winning or blocking move is available', () => {
        // Create a new board with no immediate wins
        const newBoard = Array(25).fill(null);
        newBoard[0] = '✕';
        newBoard[24] = '⭘';
        
        // Center position (12) should be selected
        expect(getHeuristicMove(newBoard)).toBe(12);
    });

    test('Prioritizes corners when center is taken', () => {
        // Create a board where center is taken
        const boardWithCenter = Array(25).fill(null);
        boardWithCenter[12] = '✕'; // Center taken
        
        // Should choose one of the corners or edge centers
        const move = getHeuristicMove(boardWithCenter);
        const priorityPositions = [0, 4, 20, 24, 6, 8]; // Corners and edge centers
        
        expect(priorityPositions.includes(move)).toBe(true);
    });

    test('Falls back to any empty cell when priorities are taken', () => {
        // Create a board where strategic positions are taken
        const filledBoard = Array(25).fill(null);
        // Fill strategic positions
        filledBoard[12] = '✕'; // Center
        filledBoard[0] = '⭘';  // Corner
        filledBoard[4] = '✕';  // Corner
        filledBoard[20] = '⭘'; // Corner
        filledBoard[24] = '✕'; // Corner
        filledBoard[6] = '⭘';  // Edge center
        filledBoard[8] = '✕';  // Edge center
        filledBoard[16] = '⭘'; // Edge center
        filledBoard[18] = '✕'; // Edge center
        
        const move = getHeuristicMove(filledBoard);
        // Import functions from AiLogic.js

        // Test Suite for checkWin function
        describe('checkWin Function', () => {
            test('Correctly identifies horizontal wins', () => {
                // Create a board with horizontal X win (first row)
                const horizontalWinBoard = Array(25).fill(null);
                horizontalWinBoard[0] = '✕';
                horizontalWinBoard[1] = '✕';
                horizontalWinBoard[2] = '✕';
                horizontalWinBoard[3] = '✕';
                horizontalWinBoard[4] = '✕';
                
                expect(checkWin(horizontalWinBoard, '✕')).toBe(true);
                expect(checkWin(horizontalWinBoard, '⭘')).toBe(false);
                
                // Test another row
                const secondRowWinBoard = Array(25).fill(null);
                secondRowWinBoard[5] = '⭘';
                secondRowWinBoard[6] = '⭘';
                secondRowWinBoard[7] = '⭘';
                secondRowWinBoard[8] = '⭘';
                secondRowWinBoard[9] = '⭘';
                
                expect(checkWin(secondRowWinBoard, '⭘')).toBe(true);
                expect(checkWin(secondRowWinBoard, '✕')).toBe(false);
            });

            test('Correctly identifies vertical wins', () => {
                // Create a board with vertical O win (first column)
                const verticalWinBoard = Array(25).fill(null);
                verticalWinBoard[0] = '⭘';
                verticalWinBoard[5] = '⭘';
                verticalWinBoard[10] = '⭘';
                verticalWinBoard[15] = '⭘';
                verticalWinBoard[20] = '⭘';
                
                expect(checkWin(verticalWinBoard, '⭘')).toBe(true);
                expect(checkWin(verticalWinBoard, '✕')).toBe(false);
                
                // Test another column
                const secondColWinBoard = Array(25).fill(null);
                secondColWinBoard[1] = '✕';
                secondColWinBoard[6] = '✕';
                secondColWinBoard[11] = '✕';
                secondColWinBoard[16] = '✕';
                secondColWinBoard[21] = '✕';
                
                expect(checkWin(secondColWinBoard, '✕')).toBe(true);
            });

            test('Correctly identifies diagonal wins', () => {
                // Create a board with diagonal X win (top-left to bottom-right)
                const diagonalWinBoard = Array(25).fill(null);
                diagonalWinBoard[0] = '✕';
                diagonalWinBoard[6] = '✕';
                diagonalWinBoard[12] = '✕';
                diagonalWinBoard[18] = '✕';
                diagonalWinBoard[24] = '✕';
                
                expect(checkWin(diagonalWinBoard, '✕')).toBe(true);
                
                // Create a board with diagonal O win (top-right to bottom-left)
                const antiDiagonalWinBoard = Array(25).fill(null);
                antiDiagonalWinBoard[4] = '⭘';
                antiDiagonalWinBoard[8] = '⭘';
                antiDiagonalWinBoard[12] = '⭘';
                antiDiagonalWinBoard[16] = '⭘';
                antiDiagonalWinBoard[20] = '⭘';
                
                expect(checkWin(antiDiagonalWinBoard, '⭘')).toBe(true);
            });

            test('Correctly identifies no win condition', () => {
                // Create a board with no win
                const noWinBoard = Array(25).fill(null);
                noWinBoard[0] = '✕';
                noWinBoard[1] = '⭘';
                noWinBoard[2] = '✕';
                noWinBoard[6] = '✕';
                noWinBoard[12] = '⭘';
                
                expect(checkWin(noWinBoard, '✕')).toBe(false);
                expect(checkWin(noWinBoard, '⭘')).toBe(false);
                
                // Create a board with incomplete win (only 4 in a row)
                const incompleteWinBoard = Array(25).fill(null);
                incompleteWinBoard[0] = '⭘';
                incompleteWinBoard[1] = '⭘';
                incompleteWinBoard[2] = '⭘';
                incompleteWinBoard[3] = '⭘';
                // Missing the fifth '⭘' at index 4
                
                expect(checkWin(incompleteWinBoard, '⭘')).toBe(false);
            });
        });

        // Test Suite for findWinningMove function
        describe('findWinningMove Function', () => {
            test('Identifies winning move when available', () => {
                // Create a board where O can win in the next move
                const almostWinBoard = Array(25).fill(null);
                almostWinBoard[0] = '⭘';
                almostWinBoard[1] = '⭘';
                almostWinBoard[2] = '⭘';
                almostWinBoard[3] = '⭘';
                // Missing '⭘' at position 4 for a win
                
                expect(findWinningMove(almostWinBoard, '⭘')).toBe(4);
                
                // Create a board where X can win in the next move (vertical)
                const verticalAlmostWinBoard = Array(25).fill(null);
                verticalAlmostWinBoard[0] = '✕';
                verticalAlmostWinBoard[5] = '✕';
                verticalAlmostWinBoard[10] = '✕';
                verticalAlmostWinBoard[15] = '✕';
                // Missing '✕' at position 20 for a win
                
                expect(findWinningMove(verticalAlmostWinBoard, '✕')).toBe(20);
            });

            test('Identifies diagonal winning move', () => {
                // Create a board with diagonal almost-win
                const diagonalAlmostWinBoard = Array(25).fill(null);
                diagonalAlmostWinBoard[0] = '✕';
                diagonalAlmostWinBoard[6] = '✕';
                diagonalAlmostWinBoard[12] = '✕';
                diagonalAlmostWinBoard[18] = '✕';
                // Missing '✕' at position 24 for a win
                
                expect(findWinningMove(diagonalAlmostWinBoard, '✕')).toBe(24);
            });

            test('Returns null when no winning move is available', () => {
                // Create a board with no immediate win possible
                const noWinPossibleBoard = Array(25).fill(null);
                noWinPossibleBoard[0] = '⭘';
                noWinPossibleBoard[6] = '✕';
                noWinPossibleBoard[12] = '⭘';
                
                expect(findWinningMove(noWinPossibleBoard, '⭘')).toBe(null);
                expect(findWinningMove(noWinPossibleBoard, '✕')).toBe(null);
            });

            test('Returns first winning move when multiple are available', () => {
                // Create a board with two potential winning moves
                const multipleWinsBoard = Array(25).fill(null);
                // Horizontal almost-win
                multipleWinsBoard[0] = '⭘';
                multipleWinsBoard[1] = '⭘';
                multipleWinsBoard[2] = '⭘';
                multipleWinsBoard[3] = '⭘';
                // Vertical almost-win
                multipleWinsBoard[5] = '⭘';
                multipleWinsBoard[10] = '⭘';
                multipleWinsBoard[15] = '⭘';
                multipleWinsBoard[20] = '⭘';
                
                // Should return either 4 or 0 depending on implementation order
                const winMove = findWinningMove(multipleWinsBoard, '⭘');
                expect([4, 0].includes(winMove)).toBe(true);
            });
        });

        // Test Suite for getEmptyCells function
        describe('getEmptyCells Function', () => {
            test('Returns all empty cells on empty board', () => {
                const emptyBoard = Array(25).fill(null);
                const emptyCells = getEmptyCells(emptyBoard);
                expect(emptyCells.length).toBe(25);
                expect(emptyCells).toEqual(Array.from({ length: 25 }, (_, i) => i));
            });

            test('Returns only empty cells on partially filled board', () => {
                const partialBoard = Array(25).fill(null);
                partialBoard[0] = '✕';
                partialBoard[12] = '⭘';
                partialBoard[24] = '✕';
                
                const emptyCells = getEmptyCells(partialBoard);
                expect(emptyCells.length).toBe(22);
                expect(emptyCells).not.toContain(0);
                expect(emptyCells).not.toContain(12);
                expect(emptyCells).not.toContain(24);
            });

            test('Returns empty array on full board', () => {
                const fullBoard = Array(25).fill('✕');
                const emptyCells = getEmptyCells(fullBoard);
                expect(emptyCells).toEqual([]);
                expect(emptyCells.length).toBe(0);
            });
        });

        // Test Suite for getRandomMove function
        describe('getRandomMove Function', () => {
            test('Returns a valid move on an empty board', () => {
                const emptyBoard = Array(25).fill(null);
                const move = getRandomMove(emptyBoard);
                expect(move >= 0 && move < 25).toBe(true);
            });
            
            test('Returns a valid move on a partially filled board', () => {
                const partialBoard = Array(25).fill(null);
                partialBoard[0] = '✕';
                partialBoard[12] = '⭘';
                partialBoard[24] = '✕';
                
                const move = getRandomMove(partialBoard);
                expect(move >= 0 && move < 25).toBe(true);
                expect([0, 12, 24].includes(move)).toBe(false);
            });
            
            test('Chooses from available moves only', () => {
                // Create a board with only one empty cell
                const almostFullBoard = Array(25).fill('✕');
                almostFullBoard[15] = null; // Only position 15 is empty
                
                const move = getRandomMove(almostFullBoard);
                expect(move).toBe(15);
            });
            
            // This test uses Jest's mocking to ensure random selection
            test('Uses random selection for moves', () => {
                // Mock Math.random to return specific values
                const mockMath = Object.create(global.Math);
                mockMath.random = jest.fn()
                    .mockReturnValueOnce(0.1) // Should select first empty cell
                    .mockReturnValueOnce(0.9); // Should select last empty cell
                global.Math = mockMath;
                
                const board = Array(25).fill(null);
                board[0] = '✕';
                
                // First call should select first available position
                expect(getRandomMove(board)).toBe(1);
                
                // Second call should select last available position
                expect(getRandomMove(board)).toBe(24);
                
                // Restore original Math
                global.Math = Object.create(mockMath);
            });
        });

        // Test Suite for getHeuristicMove function
        describe('getHeuristicMove Function', () => {
            test('Returns winning move when available', () => {
                // Create a board where O can win
                const winningBoard = Array(25).fill(null);
                winningBoard[0] = '⭘';
                winningBoard[1] = '⭘';
                winningBoard[2] = '⭘';
                winningBoard[3] = '⭘';
                // Position 4 is the winning move
                
                expect(getHeuristicMove(winningBoard)).toBe(4);
            });

            test('Blocks opponent winning move when no winning move is available', () => {
                // Create a board where X can win and needs to be blocked
                const blockingBoard = Array(25).fill(null);
                blockingBoard[5] = '✕';
                blockingBoard[6] = '✕';
                blockingBoard[7] = '✕';
                blockingBoard[8] = '✕';
                // Position 9 should be blocked
                
                expect(getHeuristicMove(blockingBoard)).toBe(9);
            });

            test('Prioritizes center when no winning or blocking move is available', () => {
                // Create a new board with no immediate wins
                const newBoard = Array(25).fill(null);
                newBoard[0] = '✕';
                newBoard[24] = '⭘';
                
                // Center position (12) should be selected
                expect(getHeuristicMove(newBoard)).toBe(12);
            });
            
            test('Prioritizes diagonals for blocking', () => {
                // Create a board with diagonal threat
                const diagonalThreatBoard = Array(25).fill(null);
                diagonalThreatBoard[0] = '✕';
                diagonalThreatBoard[6] = '✕';
                diagonalThreatBoard[12] = '✕';
                diagonalThreatBoard[18] = '✕';
                // Should block position 24
                
                expect(getHeuristicMove(diagonalThreatBoard)).toBe(24);
            });

            test('Correctly handles almost-full board', () => {
                // Create a nearly full board with one winning move
                const almostFullBoard = Array(25).fill('⭘');
                almostFullBoard[0] = '✕';
                almostFullBoard[1] = '✕';
                almostFullBoard[2] = '✕';
                almostFullBoard[3] = '✕';
                almostFullBoard[4] = null; // Winning move for X
                almostFullBoard[24] = null; // Another empty spot
                
                // Should block X's win at position 4
                expect(getHeuristicMove(almostFullBoard)).toBe(4);
            });

            test('Prioritizes corners when center is taken', () => {
                // Create a board where center is taken
                const boardWithCenter = Array(25).fill(null);
                boardWithCenter[12] = '✕'; // Center taken
                
                // Should choose one of the corners or edge centers
                const move = getHeuristicMove(boardWithCenter);
                const priorityPositions = [0, 4, 20, 24, 6, 8]; // Corners and edge centers
                
                expect(priorityPositions.includes(move)).toBe(true);
            });

            test('Falls back to any empty cell when priorities are taken', () => {
                // Create a board where strategic positions are taken
                const filledBoard = Array(25).fill(null);
                // Fill strategic positions
                filledBoard[12] = '✕'; // Center
                filledBoard[0] = '⭘';  // Corner
                filledBoard[4] = '✕';  // Corner
                filledBoard[20] = '⭘'; // Corner
                filledBoard[24] = '✕'; // Corner
                filledBoard[6] = '⭘';  // Edge center
                filledBoard[8] = '✕';  // Edge center
                filledBoard[16] = '⭘'; // Edge center
                filledBoard[18] = '✕'; // Edge center
                
                const move = getHeuristicMove(filledBoard);
                // Move should be a valid index and cell should be empty
                expect(move >= 0 && move < 25).toBe(true);
                expect(filledBoard[move]).toBe(null);
            });
        });
        const consoleSpy = jest.spyOn(console, 'log');
        
        // Call function and verify it logs the fallback message
        const move = getMinimaxMove(board);
        
        expect(consoleSpy).toHaveBeenCalledWith("Minimax AI selected - using heuristic fallback");
        
        // Restore console.log
        consoleSpy.mockRestore();
    });

    test('Returns a valid move', () => {
        const board = Array(25).fill(null);
        board[0] = '✕';
        board[6] = '⭘';
        
        const move = getMinimaxMove(board);
        expect(move >= 0 && move < 25).toBe(true);
        expect(board[move]).toBe(null); // Should be an empty cell
    });
});

describe('getMinimaxMove Function', () => {
    test('Logs fallback message', () => {
        const board = Array(25).fill(null);
        const consoleSpy = jest.spyOn(console, 'log');
        
        // Call function and verify it logs the fallback message
        const minimaxMove = getMinimaxMove(board); // Changed variable name from 'move' to 'minimaxMove'
        
        expect(consoleSpy).toHaveBeenCalledWith("Minimax AI selected - using heuristic fallback");
        
        // Restore console.log
        consoleSpy.mockRestore();
    });

    test('Returns a valid move', () => {
        const board = Array(25).fill(null);
        board[0] = '✕';
        board[6] = '⭘';
        
        const move = getMinimaxMove(board);
        expect(move >= 0 && move < 25).toBe(true);
        expect(board[move]).toBe(null); // Should be an empty cell
    });
});

describe('getComputerMove Function', () => {
    test('Returns move and timing for heuristic algorithm', () => {
        const board = Array(25).fill(null);
        const result = getComputerMove(board, 'heuristic');
        
        expect(result).toHaveProperty('move');
        expect(result).toHaveProperty('timeTaken');
        expect(typeof result.timeTaken).toBe('number');
    });

    test('Returns move and timing for random algorithm', () => {
        const board = Array(25).fill(null);
        const result = getComputerMove(board, 'random');
        
        expect(result).toHaveProperty('move');
        expect(result).toHaveProperty('timeTaken');
    });
    
    test('Returns move and timing for minimax algorithm', () => {
        const board = Array(25).fill(null);
        const result = getComputerMove(board, 'minimax');
        
        expect(result).toHaveProperty('move');
        expect(result).toHaveProperty('timeTaken');
    });

    test('Defaults to heuristic when algorithm is not specified', () => {
        const board = Array(25).fill(null);
        // Set up a board where heuristic would take center
        board[0] = '✕';
        
        // Mock heuristic function to verify it's called
        const originalHeuristic = getHeuristicMove;
        global.getHeuristicMove = jest.fn().mockReturnValue(12);
        
        const result = getComputerMove(board);
        
        expect(global.getHeuristicMove).toHaveBeenCalled();
        
        // Restore original function
        global.getHeuristicMove = originalHeuristic;
    });
    
    test('Returns valid move for all algorithms on partially filled board', () => {
        // Create partially filled board
        const board = Array(25).fill(null);
        board[0] = '✕';
        board[6] = '⭘';
        board[12] = '✕';
        board[18] = '⭘';
        
        const algorithms = ['heuristic', 'random', 'minimax'];
        
        algorithms.forEach(algorithm => {
            const result = getComputerMove(board, algorithm);
            expect(result.move >= 0 && result.move < 25).toBe(true);
            expect(board[result.move]).toBe(null); // Should be an empty cell
        });
    });
});
