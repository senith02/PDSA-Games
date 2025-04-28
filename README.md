# PDSA-Games
Games with different algorithms

## Features

- 🧠 Play and visualize classic algorithmic problems:
  - Tic-Tac-Toe (Minimax, Random)
  - Traveling Salesman Problem (Greedy, Dynamic Programming, Genetic Algorithm)
  - Tower of Hanoi (Recursive, Iterative, 4-peg)
  - Eight Queens (Backtracking, Parallel Solutions)
  - Knight's Tour (Warnsdorff’s Rule, Backtracking)
- 📊 Compare performance and visualize time complexity
- 📝 Store game results and algorithm run-times in a database
- 🖥️ Responsive UI built with React

## Project Structure

```
PDSA-Games/
├── frontend/               # React frontend
│   ├── public/             # Static assets (e.g., vite.svg)
│   ├── src/                # Source code
│   │   ├── assets/         # Static assets (e.g., images, icons)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── chessboard/ # Chessboard-related components
│   │   │   ├── TicTacToe/  # Tic-Tac-Toe components
│   │   │   ├── travelingSalesmen/ # Traveling Salesman Problem components
│   │   │   ├── TowerOfHanoi/ # Tower of Hanoi components
│   │   │   └── PlayerModal.jsx # Modal for player input
│   │   ├── pages/          # Page-level components
│   │   │   ├── KnightsTour.jsx # Knight's Tour page
│   │   │   ├── TowerOfHanoi.jsx # Tower of Hanoi page
│   │   │   ├── TicTacToe.jsx    # Tic-Tac-Toe page
│   │   │   └── EightQueens.jsx  # Eight Queens page
│   │   ├── App.jsx         # Root component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies (React, axios, etc.)
│   ├── vite.config.js      # Vite configuration
│   └── .gitignore          # Ignore build files, node_modules, etc.
├── backend/                # Node.js backend
│   ├── algorithms/         # Core algorithm implementations
│   │   ├── knightsTour.js  # Knight's Tour algorithms
│   │   ├── eightQueens/    # Eight Queens algorithms
│   │   └── towerOfHanoi/   # Tower of Hanoi algorithms
│   ├── controllers/        # Logic for handling requests
│   │   ├── knightsTourController.js
│   │   ├── towerOfHanoiController.js
│   │   └── tspController.js
│   ├── models/             # Database schemas (e.g., MongoDB with Mongoose)
│   │   ├── HanoiResult.js  # Schema for Tower of Hanoi results
│   │   └── KnightsTourResult.js # Schema for Knight's Tour results
│   ├── routes/             # API endpoints
│   │   ├── knightsTourRoutes.js
│   │   ├── towerOfHanoiRoutes.js
│   │   └── eightQueensRoutes.js
│   ├── db/                 # Database connection
│   │   └── db.js           # MongoDB connection setup
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies (Express, Mongoose, etc.)
├── .gitignore              # Ignore node_modules, .env, etc.
└── README.md               # Project overview and setup instructions
```
