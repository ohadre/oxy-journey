'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Scene3DWrapper to ensure it only renders on the client side
const Scene3DWrapper = dynamic(() => import('@/components/Scene3DWrapper'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Scene3DWrapper />
    </main>
  );
} 