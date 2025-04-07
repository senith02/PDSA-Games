# PDSA-Games
Games with different algorithms

## Project Structure

```
PDSA CW/
├── frontend/PDSA-Games                # React frontend
│   ├── public/             # Static assets (e.g., index.html, favicon)
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   │   ├── GameMenu.js        # Main menu for selecting games
│   │   │   ├── TicTacToe.js       # Tic-Tac-Toe UI
│   │   │   ├── TSP.js             # Traveling Salesman Problem UI
│   │   │   ├── TowerOfHanoi.js    # Tower of Hanoi UI
│   │   │   ├── EightQueens.js     # Eight Queens UI
│   │   │   └── KnightsTour.js     # Knight's Tour UI
│   │   ├── pages/          # Page-level components
│   │   │   └── Home.js     # Landing page with game menu
│   │   ├── utils/          # Utility functions (e.g., API calls)
│   │   ├── styles/         # CSS or styled-components
│   │   ├── App.js          # Root component
│   │   └── index.js        # Entry point
│   ├── package.json        # Frontend dependencies (React, axios, etc.)
│   └── .env                # Environment variables (e.g., API URL)
├── backend/                # Node.js backend
│   ├── controllers/        # Logic for handling requests
│   │   ├── ticTacToeController.js
│   │   ├── tspController.js
│   │   ├── towerOfHanoiController.js
│   │   ├── eightQueensController.js
│   │   └── knightsTourController.js
│   ├── models/             # Database schemas (e.g., MongoDB with Mongoose)
│   │   ├── GameResult.js   # Schema for storing player responses
│   │   └── AlgorithmTime.js # Schema for algorithm performance
│   ├── routes/             # API endpoints
│   │   ├── ticTacToeRoutes.js
│   │   ├── tspRoutes.js
│   │   ├── towerOfHanoiRoutes.js
│   │   ├── eightQueensRoutes.js
│   │   └── knightsTourRoutes.js
│   ├── algorithms/         # Core algorithm implementations
│   │   ├── ticTacToe/      # Two algorithms for Tic-Tac-Toe
│   │   ├── tsp/            # Three algorithms for TSP
│   │   ├── towerOfHanoi/   # Recursive, iterative, and 4-peg solutions
│   │   ├── eightQueens/    # Sequential and threaded solutions
│   │   └── knightsTour/    # Two algorithms for Knight's Tour
│   ├── tests/              # Unit tests
│   │   ├── ticTacToe.test.js
│   │   ├── tsp.test.js
│   │   ├── towerOfHanoi.test.js
│   │   ├── eightQueens.test.js
│   │   └── knightsTour.test.js
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies (Express, Mongoose, etc.)
│   └── .env                # Environment variables (e.g., DB connection)
├── docs/                   # Documentation and reports
│   ├── individual-reports/ # Individual report drafts
│   ├── group-report/       # Group report draft
│   └── screenshots/        # UI and code screenshots
├── .gitignore              # Ignore node_modules, .env, etc.
└── README.md               # Project overview and setup instructions
```
