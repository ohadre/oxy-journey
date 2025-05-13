'use client';

import React from 'react'; // Suspense is no longer imported or used here directly
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
  console.log('[GamePage] Rendering, will render GameSceneLoader directly.');

  // The Suspense boundary is now inside GameSceneLoader
  return <GameSceneLoader key="static-game-loader-key" />;
  // Retaining the key for now, though its effect might change with Suspense moved.
} 