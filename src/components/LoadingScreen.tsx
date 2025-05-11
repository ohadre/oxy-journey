import React, { useEffect, useState } from 'react';
import { useLoading } from './LoadingManager';

interface LoadingScreenProps {
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress: propProgress }) => {
  const { progress: contextProgress } = useLoading();
  const progress = propProgress !== undefined ? propProgress : contextProgress;
  const [fadeOut, setFadeOut] = useState(false);
  
  // Start fade-out animation when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      // Wait a moment before starting the fade out
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div 
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="text-center mb-8 transition-all duration-500">
        <h1 className="text-4xl font-bold text-white mb-2">Oxy Journey</h1>
        <p className="text-xl text-blue-400">Educational 3D Adventure</p>
      </div>
      
      <div className="w-80 bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="w-full h-3 bg-gray-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white text-lg">Loading assets...</p>
        <p className="text-blue-400 text-md mt-2 font-bold">{Math.round(progress)}%</p>
      </div>
      
      <div className="text-gray-500 mt-8 text-sm">
        <p>Preparing your educational journey</p>
      </div>
    </div>
  );
}; 