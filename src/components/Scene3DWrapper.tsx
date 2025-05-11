'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import Scene3D with no SSR
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => <div>Loading 3D Scene...</div>
});

export default function Scene3DWrapper() {
  return (
    <Suspense fallback={<div>Loading 3D Scene...</div>}>
      <Scene3D />
    </Suspense>
  );
} 