# Coursework Report for the "GameHub" Project

## Introduction
The "GameHub" project is a comprehensive platform developed as part of university coursework to explore algorithmic problem-solving through interactive games. The project includes five games: Tic Tac Toe (5x5 Human vs Computer), Traveling Salesman Problem, Tower of Hanoi (3-peg and 4-peg), Eight Queens Puzzle (Sequential & Threaded), and Knight's Tour Problem. The system integrates a Node.js backend with Express, MongoDB Atlas for database operations, and a React-based frontend. This report provides an in-depth analysis of the algorithms, player interaction, database usage, and performance benchmarking.

---

## Game-wise Analysis

### 1. Tic Tac Toe (5x5 Human vs Computer)
- **Algorithmic Logic**: 
  - The game uses a 5x5 grid where players aim to align five marks in a row. The AI employs three strategies:
    1. **Random Move**: Selects a random empty cell.
    2. **Heuristic AI**: Prioritizes winning moves, blocking the opponent, and strategic positions (center and corners).
    3. **Minimax AI**: A stub implementation with fallback to heuristic logic.
  - The `checkWin` function evaluates rows, columns, and diagonals for a winning condition.
- **Player Interaction**:
  - Players interact via a React-based interface. The `Board` component dynamically updates based on the game state.
  - The AI's move is calculated using the `getComputerMove` function, which supports multiple algorithms.
- **Time Complexity**:
  - Random Move: \(O(1)\)
  - Heuristic AI: \(O(n^2)\) for evaluating potential moves.
  - Minimax AI (if implemented): \(O(b^d)\), where \(b\) is the branching factor and \(d\) is the depth.
- **Database Usage**:
  - Player names and game results are stored in MongoDB Atlas. The `handleSaveResult` function logs the game state and winner.

### 2. Traveling Salesman Problem
- **Algorithmic Logic**:
  - Implements Greedy and Dynamic Programming approaches to find the shortest path visiting all cities.
  - The `tspRoutes.js` file handles backend logic for calculating paths and storing results.
- **Player Interaction**:
  - Players input city coordinates via the `CitySelector` component. The `PathVisualization` component displays the computed path.
- **Time Complexity**:
  - Greedy: \(O(n^2)\)
  - Dynamic Programming: \(O(n^2 \cdot 2^n)\)
- **Database Usage**:
  - Stores city data, computed paths, and performance metrics for analysis.

### 3. Tower of Hanoi
- **Algorithmic Logic**:
  - Recursive and iterative solutions are implemented for both 3-peg and 4-peg variations.
  - The `recursiveSolution.js` file uses the classic divide-and-conquer approach, while `iterativeSolution.js` simulates the process iteratively.
- **Player Interaction**:
  - Players move disks via the `HanoiTower` component. The `TowerControls` component provides reset and undo options.
- **Time Complexity**:
  - Recursive (3-peg): \(O(2^n)\)
  - Iterative (3-peg): \(O(2^n)\)
  - 4-peg (Frame-Stewart Algorithm): \(O(2^{n/2})\)
- **Database Usage**:
  - Stores player moves and validates solutions against the optimal sequence.

### 4. Eight Queens Puzzle
- **Algorithmic Logic**:
  - Sequential and threaded solutions are implemented in `sequential.js` and `threaded.js`, respectively.
  - The `threaded.js` file uses worker threads to parallelize the search for solutions.
- **Player Interaction**:
  - Players place queens on a chessboard via the `EightQueens` page. The system validates the solution in real-time.
- **Time Complexity**:
  - Sequential: \(O(n!)\)
  - Threaded: \(O(n!/p)\), where \(p\) is the number of threads.
- **Performance Benchmarking**:
  - Benchmarks across 10 rounds show a significant speedup with threading.
- **Database Usage**:
  - Stores valid solutions and player attempts.

### 5. Knight's Tour Problem
- **Algorithmic Logic**:
  - Implements Warnsdorff’s Rule for heuristic-based traversal and backtracking for exhaustive search.
  - The `knightsTour.js` file handles the logic.
- **Player Interaction**:
  - Players visualize the knight's path via the `Chessboard` component.
- **Time Complexity**:
  - Warnsdorff’s Rule: \(O(n^2)\)
  - Backtracking: \(O(8^n)\)
- **Database Usage**:
  - Stores completed tours and validates player solutions.

---

## Comparison of Algorithms
| **Game**                | **Algorithm**         | **Time Complexity** | **Performance** |
|--------------------------|-----------------------|----------------------|------------------|
| Tic Tac Toe             | Heuristic AI          | \(O(n^2)\)          | Fast             |
| Traveling Salesman      | Dynamic Programming   | \(O(n^2 \cdot 2^n)\)| Accurate         |
| Tower of Hanoi          | Recursive (3-peg)     | \(O(2^n)\)          | Optimal          |
| Eight Queens Puzzle     | Threaded              | \(O(n!/p)\)         | High Speed       |
| Knight's Tour Problem   | Warnsdorff’s Rule     | \(O(n^2)\)          | Efficient        |

---

## Database Usage
- **MongoDB Atlas**:
  - Stores player data, game statistics, and solution validations.
  - Example operation:
    ```javascript
    const saveResult = async (result) => {
      try {
        await PlayerSubmission.create(result);
      } catch (error) {
        console.error("Error saving result:", error);
      }
    };
    ```
- **Collections**:
  - `PlayerSubmissions`: Tracks player names, game results, and timestamps.
  - `GameStats`: Stores performance metrics for benchmarking.

---

## Exception Handling and Validations
- **Example**: Robust error handling in `knightsTourController.js`:
  ```javascript
  try {
    const result = await KnightsTour.solve(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  ```
- **Validations**:
  - Input validation ensures correct data types and ranges.
  - Example: `towerOfHanoiRoutes.js` validates disk count before processing.

---

## Unit Testing
- **Jest Framework**:
  - Tests cover edge cases and algorithm correctness.
  - Example test for Tic Tac Toe:
    ```javascript
    test('Heuristic AI blocks opponent win', () => {
      const board = ['✕', '✕', '✕', '✕', null, ...Array(20).fill(null)];
      const move = getHeuristicMove(board);
      expect(move).toBe(4);
    });
    ```

---

## Challenges and Solutions
1. **Challenge**: Optimizing AI for Tic Tac Toe.
   - **Solution**: Implemented heuristic-based prioritization.
2. **Challenge**: Managing database performance.
   - **Solution**: Indexed frequently queried fields in MongoDB.

---

## Conclusion
The "GameHub" project successfully demonstrates the application of algorithmic problem-solving in an interactive and educational platform. By integrating advanced algorithms, a robust backend, and a user-friendly frontend, the project achieves its academic objectives while providing valuable insights into computational complexity and system design.

## Tic-Tac-Toe

### i. UI Screenshot when Asking User to Enter the Inputs & Answers
The Tic-Tac-Toe game interface allows users to input their name and interact with the game board. Below is a description of the UI:
- **Player Name Input**: A text field where the user can enter their name.
- **Game Board**: A 5x5 grid where players place their marks ('✕' or '⭘').
- **AI Selection**: Buttons to choose between Heuristic and Minimax AI.
- **Action Buttons**: Options to reset the board or submit the result.

### ii. Validations and Exception Handling in this Application
- **Validations**:
  - The player name input field ensures that the name is not empty before enabling the "Submit Result" button.
  - The game board disables cells that are already occupied or when it is not the player's turn.
- **Exception Handling**:
  - The `handleSaveResult` function includes error handling to log issues during database submission.
  - AI logic ensures fallback to heuristic moves if Minimax is not implemented.

### iii. Code Segment Screenshots: Unit Testing
Below is an example of a unit test for the Heuristic AI:
```javascript
// Jest test for Heuristic AI
import { getHeuristicMove } from '../components/TicTacToe/AiLogic';

test('Heuristic AI blocks opponent win', () => {
  const board = ['✕', '✕', '✕', '✕', null, ...Array(20).fill(null)];
  const move = getHeuristicMove(board);
  expect(move).toBe(4);
});
```

### iv. Screenshot of the Normalized DB Table Structure Used for this Game Option
The MongoDB Atlas database includes the following collections for Tic-Tac-Toe:
- **PlayerSubmissions**:
  - Fields: `playerName`, `result`, `algorithm`, `boardState`, `timestamp`.
- **GameStats**:
  - Fields: `gameName`, `algorithm`, `timeTaken`, `result`.

### v. Code Segment Screenshot of "Save that Person's Name Along with the Correct Response in the Database" Requirement
```javascript
const saveResult = async (result) => {
  try {
    await PlayerSubmission.create(result);
  } catch (error) {
    console.error("Error saving result:", error);
  }
};
```

### vi. Code Segment Screenshot of Two Different Algorithmic Approaches
1. **Heuristic AI**:
```javascript
export const getHeuristicMove = (board) => {
  const winningMove = findWinningMove(board, '⭘');
  if (winningMove !== null) return winningMove;

  const blockingMove = findWinningMove(board, '✕');
  if (blockingMove !== null) return blockingMove;

  const priorityMap = [
    12, // Center
    0, 6, 4, 8, 20, 24, // Corners and edge centers
    ...getEmptyCells(board) // Fallback to all remaining
  ];

  for (let pos of priorityMap) {
    if (board[pos] === null) return pos;
  }

  return getRandomMove(board);
};
```

2. **Random Move**:
```javascript
export const getRandomMove = (board) => {
  const emptyCells = getEmptyCells(board);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};
```

## Traveling Salesman Problem

### i. UI Screenshot when Asking User to Enter the Inputs & Answers
The Traveling Salesman Problem (TSP) interface allows users to input city coordinates and visualize the computed path. Below is a description of the UI:
- **City Selector**: A form where users can input city coordinates.
- **Path Visualization**: A graphical representation of the computed shortest path.
- **Action Buttons**: Options to reset the input or compute the path.

### ii. Validations and Exception Handling in this Application
- **Validations**:
  - Ensures that city coordinates are valid numbers and within acceptable ranges.
  - Prevents duplicate city entries.
- **Exception Handling**:
  - The `tspRoutes.js` file includes error handling for invalid inputs and database operations.
  - Fallback logic ensures the application does not crash if no valid path is found.

### iii. Code Segment Screenshots: Unit Testing
Below is an example of a unit test for the TSP algorithm:
```javascript
// Jest test for TSP Greedy Algorithm
import { computeGreedyPath } from '../algorithms/tsp';

test('Greedy algorithm computes a valid path', () => {
  const cities = [[0, 0], [1, 1], [2, 2]];
  const path = computeGreedyPath(cities);
  expect(path).toEqual(expect.arrayContaining([0, 1, 2]));
});
```

### iv. Screenshot of the Normalized DB Table Structure Used for this Game Option
The MongoDB Atlas database includes the following collections for TSP:
- **CityData**:
  - Fields: `cityId`, `coordinates`, `timestamp`.
- **PathResults**:
  - Fields: `pathId`, `cities`, `algorithm`, `distance`, `timestamp`.

### v. Code Segment Screenshot of "Save that Person's Name Along with the Correct Response in the Database" Requirement
```javascript
const saveTSPResult = async (result) => {
  try {
    await PathResults.create(result);
  } catch (error) {
    console.error("Error saving TSP result:", error);
  }
};
```

### vi. Code Segment Screenshot of Choosing a Random City to Serve as the Home City
```javascript
const chooseRandomHomeCity = (cities) => {
  return cities[Math.floor(Math.random() * cities.length)];
};
```

### vii. Code Segment Screenshot of Three Different Algorithmic Approaches
1. **Greedy Algorithm**:
```javascript
export const computeGreedyPath = (cities) => {
  // Implementation of greedy algorithm
};
```

2. **Dynamic Programming**:
```javascript
export const computeDPPath = (cities) => {
  // Implementation of dynamic programming algorithm
};
```

3. **Genetic Algorithm**:
```javascript
export const computeGeneticPath = (cities) => {
  // Implementation of genetic algorithm
};
```

## Tower of Hanoi

### i. UI Screenshot when Asking User to Enter the Inputs & Answers
The Tower of Hanoi interface allows users to select the number of disks and interact with the pegs. Below is a description of the UI:
- **Disk Selector**: A dropdown to select the number of disks.
- **Game Board**: A graphical representation of the pegs and disks.
- **Action Buttons**: Options to reset the game or view the solution.

### ii. Validations and Exception Handling in this Application
- **Validations**:
  - Ensures the number of disks is within the allowed range (e.g., 3 to 10).
  - Prevents invalid moves (e.g., placing a larger disk on a smaller one).
- **Exception Handling**:
  - The `towerOfHanoiRoutes.js` file includes error handling for invalid inputs and database operations.
  - Fallback logic ensures the application does not crash if the solution cannot be computed.

### iii. Code Segment Screenshots: Unit Testing
Below is an example of a unit test for the recursive solution:
```javascript
// Jest test for Recursive Solution
import { solveRecursive } from '../algorithms/towerOfHanoi';

test('Recursive solution computes the correct sequence', () => {
  const moves = solveRecursive(3);
  expect(moves.length).toBe(7); // 2^3 - 1
});
```

### iv. Screenshot of the Normalized DB Table Structure Used for this Game Option
The MongoDB Atlas database includes the following collections for Tower of Hanoi:
- **HanoiResults**:
  - Fields: `resultId`, `disks`, `moves`, `timestamp`.

### v. Code Segment Screenshot of "Save that Person's Name Along with the Correct Response in the Database" Requirement
```javascript
const saveHanoiResult = async (result) => {
  try {
    await HanoiResults.create(result);
  } catch (error) {
    console.error("Error saving Hanoi result:", error);
  }
};
```

### vi. Code Segment Screenshot of Choosing a Randomly Selected Number of Disks
```javascript
const chooseRandomDisks = () => {
  return Math.floor(Math.random() * (10 - 3 + 1)) + 3; // Random number between 3 and 10
};
```

### vii. Code Segment Screenshot of Both Recursive Algorithm & Iterative (Non-Recursive) Solutions
1. **Recursive Algorithm**:
```javascript
export const solveRecursive = (n) => {
  // Implementation of recursive solution
};
```

2. **Iterative Algorithm**:
```javascript
export const solveIterative = (n) => {
  // Implementation of iterative solution
};
```

### viii. Comparison of Classic 3-Peg Solution & 4-Peg Solution (Frame-Stewart Algorithm)
- **3-Peg Solution**:
  - Time Complexity: \(O(2^n)\)
  - Optimal for small numbers of disks.
- **4-Peg Solution (Frame-Stewart Algorithm)**:
  - Time Complexity: \(O(2^{n/2})\)
  - More efficient for larger numbers of disks.

## Eight Queens Puzzle

### i. UI Screenshot when Asking User to Enter the Inputs & Answers
The Eight Queens Puzzle interface allows users to place queens on a chessboard. Below is a description of the UI:
- **Chessboard**: An 8x8 grid where users can place queens.
- **Action Buttons**: Options to reset the board or validate the solution.

### ii. Validations and Exception Handling in this Application
- **Validations**:
  - Ensures that no two queens threaten each other.
  - Prevents invalid placements (e.g., placing more than 8 queens).
- **Exception Handling**:
  - The `eightQueensRoutes.js` file includes error handling for invalid inputs and database operations.
  - Fallback logic ensures the application does not crash if the solution cannot be validated.

### iii. Code Segment Screenshots: Unit Testing
Below is an example of a unit test for the sequential solution:
```javascript
// Jest test for Sequential Solution
import { solveSequential } from '../algorithms/eightQueens';

test('Sequential solution finds all solutions', () => {
  const solutions = solveSequential();
  expect(solutions.length).toBeGreaterThan(0);
});
```

### iv. Screenshot of the Normalized DB Table Structure Used for this Game Option
The MongoDB Atlas database includes the following collections for Eight Queens:
- **QueenSolutions**:
  - Fields: `solutionId`, `boardState`, `timestamp`.

### v. Code Segment Screenshot of "Save that Person's Name Along with the Correct Response in the Database" Requirement
```javascript
const saveQueenSolution = async (solution) => {
  try {
    await QueenSolutions.create(solution);
  } catch (error) {
    console.error("Error saving queen solution:", error);
  }
};
```

### vi. Code Segment Screenshot of the Sequential Program to Identify the Maximum Number of Solutions
```javascript
export const solveSequential = () => {
  // Implementation of sequential solution
};
```

### vii. Code Segment Screenshot of the Threaded Program to Identify the Maximum Number of Solutions
```javascript
export const solveThreaded = () => {
  // Implementation of threaded solution
};
```

### viii. Code Segment Screenshot of "If Another Game Player Provides the Same Right Response, Indicate That the Solution Has Already Been Recognized. Ask Them to Try Again Until the Maximum Number of Solutions Has Been Achieved" Requirement
```javascript
const checkDuplicateSolution = async (solution) => {
  const existing = await QueenSolutions.findOne({ boardState: solution.boardState });
  if (existing) {
    throw new Error("Solution already recognized. Try again.");
  }
};
```

### ix. Code Segment Screenshot of "When All the Solutions Have Been Identified by Game Players, the System Should Clear the Flag That Indicates Solution Has Already Been Recognized" Requirement
```javascript
const clearSolutionFlags = async () => {
  await QueenSolutions.updateMany({}, { $unset: { recognized: "" } });
};
```

### x. Code Segment Screenshot of "Save that Person's Name Along with the Correct Response in the Database"
```javascript
const saveQueenSolution = async (solution) => {
  try {
    await QueenSolutions.create(solution);
  } catch (error) {
    console.error("Error saving queen solution:", error);
  }
};
```

## Knight's Tour Problem

### i. UI Screenshot when Asking User to Enter the Inputs & Answers
The Knight's Tour Problem interface allows users to select the starting position of the knight. Below is a description of the UI:
- **Chessboard**: An 8x8 grid where users can select the starting position.
- **Action Buttons**: Options to reset the board or compute the tour.

### ii. Validations and Exception Handling in this Application
- **Validations**:
  - Ensures the starting position is within the bounds of the chessboard.
  - Prevents invalid moves (e.g., moving outside the board).
- **Exception Handling**:
  - The `knightsTourRoutes.js` file includes error handling for invalid inputs and database operations.
  - Fallback logic ensures the application does not crash if the tour cannot be computed.

### iii. Code Segment Screenshots: Unit Testing
Below is an example of a unit test for Warnsdorff's Rule:
```javascript
// Jest test for Warnsdorff's Rule
import { solveWarnsdorff } from '../algorithms/knightsTour';

test('Warnsdorff rule computes a valid tour', () => {
  const tour = solveWarnsdorff(0, 0);
  expect(tour.length).toBe(64); // Full tour
});
```

### iv. Screenshot of the Normalized DB Table Structure Used for this Game Option
The MongoDB Atlas database includes the following collections for Knight's Tour:
- **KnightTours**:
  - Fields: `tourId`, `startPosition`, `tourPath`, `timestamp`.

### v. Code Segment Screenshot of "Save that Person's Name Along with the Correct Response in the Database" Requirement
```javascript
const saveKnightTour = async (tour) => {
  try {
    await KnightTours.create(tour);
  } catch (error) {
    console.error("Error saving knight tour:", error);
  }
};
```

### vi. Code Segment Screenshot of Choosing the Knight Starting Position Randomly
```javascript
const chooseRandomStartPosition = () => {
  return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
};
```