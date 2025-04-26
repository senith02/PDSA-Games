import React from 'react';

const Board = ({ board, onCellClick, isHumanTurn, winner }) => {
  return (
    <div className="grid grid-cols-5 gap-2 mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
      {board.map((value, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={!isHumanTurn || winner || value}
          className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-3xl font-bold rounded-lg transition-all duration-200
                      ${value === '✕' ? 'text-blue-400' : value === '⭘' ? 'text-purple-400' : 'text-gray-400'}
                      ${!value && isHumanTurn && !winner ? 
                        'hover:bg-gray-700/60 cursor-pointer' : 
                        'cursor-default'}
                      ${!isHumanTurn ? 'opacity-80' : ''}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default Board;