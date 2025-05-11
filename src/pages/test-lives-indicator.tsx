import React, { useState } from 'react';
import LivesIndicator from '@/components/LivesIndicator';

export default function TestLivesIndicatorPage() {
  const [lives, setLives] = useState(3);

  const decreaseLives = () => {
    setLives(prev => Math.max(0, prev - 1));
  };

  const resetLives = () => {
    setLives(3);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Lives Indicator Test</h1>
      
      <div className="mb-8 flex gap-4">
        <button 
          onClick={decreaseLives} 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Lose a Life
        </button>
        
        <button 
          onClick={resetLives}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Reset Lives
        </button>
      </div>
      
      <div className="relative w-full h-96 bg-black rounded-lg flex items-center justify-center">
        <p className="text-white text-lg">Game Scene</p>
        <LivesIndicator currentLives={lives} />
      </div>
      
      <div className="mt-8 text-white">
        Current Lives: {lives}
      </div>
      
      <a 
        href="/"
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Back to Game
      </a>
    </div>
  );
} 