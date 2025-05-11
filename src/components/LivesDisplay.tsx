import React from 'react';
import { useGameState } from './GameState';

export const LivesDisplay: React.FC = () => {
  const { lives } = useGameState();

  return (
    <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg flex items-center gap-2">
      <span className="text-lg font-bold">Lives:</span>
      <div className="flex gap-1">
        {Array.from({ length: lives }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-red-500 rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}; 