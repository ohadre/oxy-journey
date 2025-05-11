'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { /* OrbitControls, */ KeyboardControls } from '@react-three/drei';
import { Oxy } from './Oxy';
// import { WorldBoundaries } from './WorldBoundaries';
import dynamic from 'next/dynamic';
import CameraController from './CameraController';
import * as THREE from 'three';
import Germ from './Germ';
import GermManager from './GermManager';
import { useLoading } from './LoadingManager';
import DustManager from './DustManager';

// Dynamically import the Tunnel component to ensure it only renders on the client side
const Tunnel = dynamic(() => import('./Tunnel'), { 
  ssr: false,
  loading: () => null
});

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
];

export default function Scene3D() {
  const [lastCollision, setLastCollision] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const worldSize = 10; // Less relevant for tunnel, kept for Oxy prop for now
  const { isLoading } = useLoading();

  const oxyMeshRef = useRef<THREE.Mesh | null>(null);
  const oxyPositionRef = useRef<[number, number, number]>([0, 0, 70]);
  const [_, setDummy] = useState(0); // For forced re-render if needed

  // Ensure component is mounted before rendering
  useEffect(() => {
    console.log('[Scene3D] Component mounted');
    setIsMounted(true);
    return () => {
      console.log('[Scene3D] Component unmounted');
      setIsMounted(false);
    };
  }, []);
  
  // Log loading state changes
  useEffect(() => {
    console.log('[Scene3D] Loading state changed:', isLoading);
  }, [isLoading]);

  const handleCollision = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    setLastCollision(direction);
    setTimeout(() => setLastCollision(null), 500);
  };

  // Tunnel height is 300, so ends are at z = ±150 relative to its center.
  // Place Oxy just inside one end.
  const oxyInitialPosition = new THREE.Vector3(0, 0, 70); 

  // Callback to update Oxy's position in the ref
  const handleOxyPositionChange = (pos: [number, number, number]) => {
    oxyPositionRef.current = pos;
    // setDummy(d => d + 1); // Uncomment if you need to force a re-render for UI
  };

  if (!isMounted) {
    console.log('[Scene3D] Not mounted yet, returning null');
    return null;
  }

  return (
    <div className="w-full h-full bg-black">
      <KeyboardControls map={keyboardMap}>
        {/* Adjust camera for longer tunnel: further back, looking down Z. Y at 0 for straight view. */}
        <Canvas camera={{ position: [0, 0, 80], fov: 70 }}> 
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 10, 40]} intensity={2.0} color="#ffd9a0" /> {/* Warm light from entrance */}
          <directionalLight position={[0, -10, -40]} intensity={1.2} color="#a0c8ff" /> {/* Cool rim light from behind */}
          
          <Suspense fallback={null}>
            <Tunnel />
          </Suspense>
          <DustManager oxyPosition={oxyPositionRef.current} />
          <GermManager oxyPosition={oxyPositionRef.current} />
          <Oxy 
            ref={oxyMeshRef} 
            worldSize={worldSize} // Will need to be adapted for tunnel collision
            onCollision={handleCollision} // Same as above
            initialPosition={oxyInitialPosition}
            onPositionChange={handleOxyPositionChange}
          />
          {/* CameraController will adjust to follow Oxy */}
          <CameraController oxyRef={oxyMeshRef} offset={new THREE.Vector3(0, 0.5, 3.5)} />
        </Canvas>
      </KeyboardControls>
      {lastCollision && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded">
          Collision: {lastCollision}
        </div>
      )}
    </div>
  );
} 