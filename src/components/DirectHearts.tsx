import React from 'react';
import { useGameState } from './GameStateContext';

// Direct Hearts Display component
const DirectHearts = () => {
  const { gameState, loseLife } = useGameState();
  const { lives } = gameState;
  
  const handleLoseLife = () => {
    loseLife();
  };
  
  return (
    <div className="fixed top-2 left-2 z-[20000] bg-black bg-opacity-80 p-3 rounded-lg border-2 border-red-500 shadow-xl">
      <div className="font-bold text-white mb-1">Lives: {lives}</div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-2xl">
            {i < lives ? '❤️' : '🖤'}
          </div>
        ))}
      </div>
      <button
        onClick={handleLoseLife}
        className="mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
      >
        Test Lose Life
      </button>
    </div>
  );
};

export default DirectHearts; 