'use client';

import React, { useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LanguageCode } from '../types/question.types'; // Adjust path
import { LoadingManager } from './LoadingManager'; // Import LoadingManager

// Dynamically import Scene3D with no SSR
const Scene3D = dynamic(() => import('./Scene3D'), { // Adjust path as necessary
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#000',
      color: 'white',
      fontSize: '2rem'
    }}>
      Preparing 3D environment...
    </div>
  )
});

// Define GameLoadingFallback here or import if it's shared
// This fallback is for the Suspense boundary if Scene3D itself needs to suspend
// The dynamic import's loading prop handles initial component load
const GameLoadingFallback = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#000',
      color: 'white',
      fontSize: '2rem'
    }}>
      Loading 3D Scene Components... 
    </div>
  );
};

interface GameSceneLoaderProps {
  // No props needed from parent initially, it fetches its own data via hook
}

const GameSceneLoader: React.FC<GameSceneLoaderProps> = () => {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');

  const gameLanguage: LanguageCode = useMemo(() => {
    console.log('[GameSceneLoader] Calculating gameLanguage. langParam:', langParam);
    if (langParam === 'he') {
      return 'he';
    }
    return 'en'; // Default to 'en'
  }, [langParam]);

  // Add effect to focus the window on load
  useEffect(() => {
    // Force the window to have focus on component mount
    window.focus();
    console.log('[GameSceneLoader] Window focused.');

    // Focus handling function
    const handleWindowClick = () => {
      window.focus();
    };

    // Add event listeners
    window.addEventListener('click', handleWindowClick);
    
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  console.log('[GameSceneLoader] Rendering Scene3D with language:', gameLanguage);
  return (
    // The outer div from Scene3DWrapper for focus and event handling might be useful
    <div 
      className="w-full h-screen bg-black" 
      tabIndex={0} 
      // onKeyDown={(e) => e.stopPropagation()} // This might interfere with game controls, let's test without it first
    >
      <LoadingManager>
        <Suspense fallback={<GameLoadingFallback />}>
          <Scene3D currentLanguage={gameLanguage} />
        </Suspense>
      </LoadingManager>
    </div>
  );
};

export default GameSceneLoader; 