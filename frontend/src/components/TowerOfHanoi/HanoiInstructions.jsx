import React from 'react';

function HanoiInstructions({ towerCount = 3 }) {
  return (
    <div className="bg-gray-800/80 p-3 rounded-lg shadow-md">
      <h3 className="text-md font-medium text-white mb-2">Instructions</h3>
      <div className="text-gray-400 text-xs">
        <p>The goal is to move all disks from Tower A to Tower {towerCount === 3 ? 'C' : 'D'}.</p>
        <p className="mt-1">You can only move one disk at a time.</p>
        <p className="mt-1">No disk may be placed on top of a smaller disk.</p>
        
        <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
          <p className="font-medium text-gray-300">How to play:</p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>Click on a tower to select the top disk</li>
            <li>Click on another tower to move the selected disk</li>
            <li>Try to complete the puzzle in minimum moves</li>
          </ul>
        </div>
        
        <div className="mt-3 text-xs">
          <p className="font-medium text-blue-400">Game Modes:</p>
          <p className="mt-1">
            <span className="text-yellow-400">3 Towers</span> - Classic Tower of Hanoi (minimum moves: 2<sup>n</sup>-1)
          </p>
          <p className="mt-1">
            <span className="text-green-400">4 Towers</span> - Extended version with an extra tower for more efficient solutions
          </p>
        </div>
        
        <div className="mt-3 text-xs">
          <p className="font-medium text-blue-400">Algorithm comparison:</p>
          <p className="mt-1"><span className="text-purple-400">Recursive</span> - Uses a simple recursive approach</p>
          <p className="mt-1"><span className="text-blue-400">Iterative</span> - Uses an iterative stack-based implementation</p>
        </div>
      </div>
    </div>
  );
}

export default HanoiInstructions;
