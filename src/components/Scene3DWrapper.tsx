'use client';

import React from 'react';
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
  return (
    <div className="w-full h-screen bg-black">
      <LoadingManager>
        <Scene3D />
      </LoadingManager>
    </div>
  );
} 