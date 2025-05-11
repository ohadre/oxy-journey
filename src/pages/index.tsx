'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create a simple initial loading component to ensure no white flash
const InitialLoader = () => (
  <div className="w-full h-screen bg-black flex items-center justify-center">
    <p className="text-white text-lg">Starting Oxy Journey...</p>
  </div>
);

// Dynamically import Scene3DWrapper to ensure it only renders on the client side
const Scene3DWrapper = dynamic(() => import('@/components/Scene3DWrapper'), {
  ssr: false,
  loading: () => <InitialLoader />
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Ensure the component is only rendered on the client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <InitialLoader />;
  }
  
  return (
    <main className="w-full h-screen bg-black">
      <Scene3DWrapper />
    </main>
  );
} 