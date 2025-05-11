import React from 'react';

interface LivesIndicatorProps {
  maxLives?: number;
  currentLives?: number;
}

const LivesIndicator: React.FC<LivesIndicatorProps> = ({ 
  maxLives = 3, 
  currentLives = 3 
}) => {
  return (
    <div className="fixed top-4 right-4 z-[99999] bg-black bg-opacity-80 p-3 rounded-lg flex flex-col items-center border-2 border-red-600 shadow-xl">
      <div className="text-white font-bold mb-2 text-lg">LIVES</div>
      <div className="flex gap-3">
        {Array.from({ length: maxLives }).map((_, i) => (
          <div 
            key={i}
            className="text-3xl"
          >
            {i < currentLives ? '❤️' : '🖤'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivesIndicator; 