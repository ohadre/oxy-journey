'use client';

import React from 'react'; // Ensured React is imported for Suspense
// useSearchParams is no longer used here
// import { useSearchParams } from 'next/navigation'; 
// Scene3D is no longer imported directly here
// import Scene3D from '../../components/Scene3D'; 
// LanguageCode might not be needed here if GameSceneLoader handles it all
// import { LanguageCode } from '../../types/question.types'; 

import GameSceneLoader from '../../components/GameSceneLoader'; // Import the new loader component

// GameLoadingFallback is now defined within GameSceneLoader.tsx or could be a shared component
// const GameLoadingFallback = () => { ... };

export default function GamePage() {
  console.log('[GamePage] Rendering, will render GameSceneLoader directly wrapped in Suspense.');

  return (
    <React.Suspense fallback={<div>Loading game parameters...</div>}>
      <GameSceneLoader key="static-game-loader-key" />
    </React.Suspense>
  );
  // Retaining the key for now, though its effect might change with Suspense moved.
} 