'use client';

import React from 'react'; // Ensure React is imported if not already
// useSearchParams is no longer used here
// import { useSearchParams } from 'next/navigation'; 
// Scene3D is no longer imported directly here
// import Scene3D from '../../components/Scene3D'; 
// LanguageCode might not be needed here if GameSceneLoader handles it all
// import { LanguageCode } from '../../types/question.types'; 

import GameSceneLoader from '@/components/GameSceneLoader'; // Import the new loader component

// GameLoadingFallback is now defined within GameSceneLoader.tsx or could be a shared component
// const GameLoadingFallback = () => { ... };

// Define the props for the Page component if you need to access searchParams
interface GamePageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Expect Promise here
}

// export default function GamePage() { // OLD
export default function GamePage({ searchParams: searchParamsPromise }: GamePageProps) { // Rename to denote Promise
  console.log('[GamePage] Rendering, will render GameSceneLoader directly wrapped in Suspense.');

  return (
    <React.Suspense fallback={<div>Loading 3D Scene...</div>}> {/* Suspense for GameSceneLoader itself if it were to do heavy async work before Scene3D, or for Scene3D */}
      {/* Pass the searchParamsPromise directly to GameSceneLoader */}
      <GameSceneLoader searchParams={searchParamsPromise} />
    </React.Suspense>
  );
  // Retaining the key for now, though its effect might change with Suspense moved.
} 