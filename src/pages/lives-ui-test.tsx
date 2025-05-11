import React from 'react';
import LivesIndicator from '@/components/LivesIndicator';

export default function LivesUITest() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Lives UI Test</h1>
      
      <div className="relative w-full max-w-2xl h-96 bg-black rounded-lg flex items-center justify-center mb-8">
        <p className="text-white text-lg">Game Scene (Simulated)</p>
        <LivesIndicator />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Full Lives</h2>
          <LivesIndicator currentLives={3} maxLives={3} />
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">2 Lives</h2>
          <LivesIndicator currentLives={2} maxLives={3} />
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">1 Life</h2>
          <LivesIndicator currentLives={1} maxLives={3} />
        </div>
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