'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
// Remove direct useSearchParams import if searchParams are passed as props
// import { useSearchParams } from 'next/navigation'; 
import Scene3D from './Scene3D'; 
import { LoadingManager as LoadingProvider } from './LoadingManager'; // Renamed to LoadingProvider for clarity if preferred
import { LanguageCode } from '../types/question.types';

const GameLoadingFallback = () => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', color: 'white', fontSize: '2rem' }}>
    Loading 3D Assets...
  </div>
);

// Define props for GameSceneLoader to accept searchParams
interface GameSceneLoaderProps {
  searchParams?: { [key: string]: string | string[] | undefined }; // Removed Promise type
}

const GameSceneLoader: React.FC<GameSceneLoaderProps> = ({ searchParams: searchParamsProp }) => {
  // searchParamsProp is now expected to be the resolved object or undefined
  const resolvedSearchParams = searchParamsProp || {}; // Use directly, provide fallback

  const currentLanguage: LanguageCode = useMemo(() => {
    const langParam = resolvedSearchParams?.['lang'];
    console.log('[GameSceneLoader] Calculating gameLanguage. langParam:', langParam);
    if (langParam === 'he') return 'he';
    if (langParam === 'en') return 'en'; // Explicitly handle 'en' if provided
    return 'he'; // Default to 'he'
  }, [resolvedSearchParams]);

  const showInstructions: boolean = useMemo(() => {
    const instructionParam = resolvedSearchParams?.['showInstructions'];
    return instructionParam === 'true';
  }, [resolvedSearchParams]);

  console.log(`[GameSceneLoader] Effective Lang: ${currentLanguage}, ShowInstructions: ${showInstructions}`);

  useEffect(() => {
    // Focus the window when the component mounts, useful for keyboard controls
    window.focus(); 
  }, []);

  return (
    <LoadingProvider>
      <Suspense fallback={<GameLoadingFallback />}>
        <Scene3D currentLanguage={currentLanguage} showInstructions={showInstructions} />
      </Suspense>
    </LoadingProvider>
  );
};

export default GameSceneLoader; 