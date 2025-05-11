'use client';

import React from 'react';
import { LivesDisplay } from '@/components/LivesDisplay';
import { GameStateProvider } from '@/components/GameStateContext';

export default function TestLivesPage() {
  console.log('[TestLivesPage] Rendering test lives page');
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <h1 className="text-2xl font-bold mb-8 text-white">Lives Display Test Page</h1>
      
      <div className="flex flex-col gap-8 items-center">
        {/* Test the LivesDisplay with GameStateProvider */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl text-white mb-4">With Context:</h2>
          <GameStateProvider>
            <div className="border-2 border-green-500 p-2">
              <LivesDisplay />
            </div>
          </GameStateProvider>
        </div>
        
        {/* This will error as it's outside the context */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl text-white mb-4">Without Context (should error):</h2>
          <div className="border-2 border-red-500 p-2">
            <div className="text-white">LivesDisplay would be here but will error</div>
            {/* Uncommenting this will cause an error: <LivesDisplay /> */}
          </div>
        </div>
        
        {/* Simple HTML hearts as a baseline */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl text-white mb-4">Basic HTML Hearts:</h2>
          <div className="flex gap-2">
            <span style={{ fontSize: '2rem' }}>❤️</span>
            <span style={{ fontSize: '2rem' }}>❤️</span>
            <span style={{ fontSize: '2rem' }}>❤️</span>
          </div>
        </div>
      </div>
      
      <a 
        href="/"
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Game
      </a>
    </div>
  );
} 