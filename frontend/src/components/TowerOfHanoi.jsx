import { useState, useEffect } from 'react';

function TowerOfHanoi() {
  const [numDisks, setNumDisks] = useState(0);
  const [moves, setMoves] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    const randomDisks = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    setNumDisks(randomDisks);
  }, []);

  const handleSubmit = async () => {
    const startTime = performance.now();
    // Validate moves and calculate time
    const endTime = performance.now();
    setTimeTaken(endTime - startTime);

    // Save result to the database
    await fetch('/api/towerOfHanoi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, numDisks, moves, timeTaken }),
    });
  };

  return (
    <div>
      <h1>Tower of Hanoi</h1>
      <p>Number of Disks: {numDisks}</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <textarea
        placeholder="Enter your sequence of moves"
        value={moves}
        onChange={(e) => setMoves(e.target.value.split('\n'))}
      />
      <button onClick={handleSubmit}>Submit</button>
      <p>Time Taken: {timeTaken}ms</p>
    </div>
  );
}

export default TowerOfHanoi;
