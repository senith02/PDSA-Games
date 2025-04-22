import React from 'react'

// Background component
function GameBackground() {
    return (
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
      </div>
    );
  }

export default GameBackground