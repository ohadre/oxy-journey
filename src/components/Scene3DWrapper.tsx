'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LoadingManager } from './LoadingManager';

// Dynamically import Scene3D with no SSR
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <p className="text-white">Preparing 3D environment...</p>
    </div>
  )
});

export default function Scene3DWrapper() {
  // Add effect to focus the window on load
  useEffect(() => {
    // Force the window to have focus on component mount
    window.focus();

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
  
  return (
    <div 
      className="w-full h-screen bg-black" 
      tabIndex={0} 
      onKeyDown={(e) => e.stopPropagation()}
    >
      <LoadingManager>
        <Scene3D />
      </LoadingManager>
    </div>
  );
} 