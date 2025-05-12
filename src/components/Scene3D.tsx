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
import LivesIndicator from './LivesIndicator';

// Dynamically import the Tunnel component to ensure it only renders on the client side
const Tunnel = dynamic(() => import('./Tunnel'), { 
  ssr: false,
  loading: () => null
});

const keyboardMap = [
  { name: 'forward', keys: ['KeyE'] },
  { name: 'backward', keys: ['KeyQ'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'up', keys: ['ArrowUp', 'KeyW'] },
  { name: 'down', keys: ['ArrowDown', 'KeyS'] },
];

export default function Scene3D() {
  const [isMounted, setIsMounted] = useState(false);
  const worldSize = 10;
  const { isLoading } = useLoading();

  const oxyMeshRef = useRef<THREE.Mesh | null>(null);
  const oxyPositionRef = useRef<[number, number, number]>([0, 0, 70]);
  const [_, setDummy] = useState(0);

  useEffect(() => {
    console.log('[Scene3D] Component mounted');
    setIsMounted(true);
    return () => {
      console.log('[Scene3D] Component unmounted');
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    console.log('[Scene3D] Loading state changed:', isLoading);
  }, [isLoading]);

  const oxyInitialPosition = new THREE.Vector3(0, 0, 70); 

  const handleOxyPositionChange = (pos: [number, number, number]) => {
    oxyPositionRef.current = pos;
  };

  if (!isMounted) {
    console.log('[Scene3D] Not mounted yet, returning null');
    return null;
  }

  return (
    <div className="w-full h-full bg-black relative">
      <LivesIndicator />
      
      <KeyboardControls map={keyboardMap}>
        <Canvas camera={{ position: [0, 0, 80], fov: 70 }}> 
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 10, 40]} intensity={2.0} color="#ffd9a0" />
          <directionalLight position={[0, -10, -40]} intensity={1.2} color="#a0c8ff" />
          
          <Suspense fallback={null}>
            <Tunnel />
          </Suspense>
          <DustManager />
          <GermManager />
          <Oxy 
            ref={oxyMeshRef} 
            worldSize={worldSize}
            initialPosition={oxyInitialPosition}
            onPositionChange={handleOxyPositionChange}
          />
          <CameraController oxyRef={oxyMeshRef} offset={new THREE.Vector3(0, 0.5, 3.5)} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
} 