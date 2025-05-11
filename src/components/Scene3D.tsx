'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { /* OrbitControls, */ KeyboardControls } from '@react-three/drei';
import { Oxy } from './Oxy';
// import { WorldBoundaries } from './WorldBoundaries';
import dynamic from 'next/dynamic';
import CameraController from './CameraController';
import * as THREE from 'three';

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

  const oxyMeshRef = useRef<THREE.Mesh>(null);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleCollision = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    setLastCollision(direction);
    setTimeout(() => setLastCollision(null), 500);
  };

  // Tunnel height is 150, so ends are at z = +/-75 relative to its center.
  // Place Oxy just inside one end.
  const oxyInitialPosition = new THREE.Vector3(0, 0, 70); 

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <KeyboardControls map={keyboardMap}>
        {/* Adjust camera for longer tunnel: further back, looking down Z. Y at 0 for straight view. */}
        <Canvas camera={{ position: [0, 0, 80], fov: 70 }}> 
          {/* <fog attach="fog" args={['#202030', 10, 100]} /> */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 10, 40]} intensity={2.0} color="#ffd9a0" /> {/* Warm light from entrance */}
          <directionalLight position={[0, -10, -40]} intensity={1.2} color="#a0c8ff" /> {/* Cool rim light from behind */}
          <Tunnel />
          {/* <OrbitControls /> */}
          <Oxy 
            ref={oxyMeshRef} 
            worldSize={worldSize} // Will need to be adapted for tunnel collision
            onCollision={handleCollision} // Same as above
            initialPosition={oxyInitialPosition}
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