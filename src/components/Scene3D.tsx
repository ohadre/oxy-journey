'use client';

import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { /* OrbitControls, */ KeyboardControls } from '@react-three/drei';
import { Oxy } from './Oxy';
// import { WorldBoundaries } from './WorldBoundaries';
import dynamic from 'next/dynamic';
import CameraController from './CameraController';
import * as THREE from 'three';
import Germ from './Germ';
import DustParticle from './DustParticle';
import GermManager, { GermInstance } from './GermManager';
import DustManager, { DustInstance } from './DustManager';
import { useLoading } from './LoadingManager';
import LivesIndicator from './LivesIndicator';
import { CollisionManager } from './CollisionManager';

// Dynamically import the Tunnel component to ensure it only renders on the client side
const Tunnel = dynamic(() => import('./Tunnel'), { 
  ssr: false,
  loading: () => null
});

// Helper Component to log camera info
// const CameraLogger = () => { ... };

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
  const [oxyPosition, setOxyPosition] = useState<[number, number, number]>([0, 0, 70]);
  const [germs, setGerms] = useState<GermInstance[]>([]);
  const [dustParticles, setDustParticles] = useState<DustInstance[]>([]);

  useEffect(() => {
    console.log('[Scene3D] Component mounted');
    setIsMounted(true);
    return () => {
      console.log('[Scene3D] Component unmounted');
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    console.warn(`[Scene3D] --- isLoading state changed: ${isLoading} ---`);
  }, [isLoading]);

  const oxyInitialPosition = useMemo(() => new THREE.Vector3(oxyPosition[0], oxyPosition[1], oxyPosition[2]), []);

  const handleOxyPositionChange = (pos: [number, number, number]) => {
    setOxyPosition(pos);
  };

  const handleGermsChange = (updatedGerms: GermInstance[]) => {
    setGerms(updatedGerms);
  };

  const handleDustChange = (updatedDust: DustInstance[]) => {
    setDustParticles(updatedDust);
  };

  const handleCollision = (type: 'germ' | 'dust', id: string) => {
    console.warn(`[Scene3D] !!! Preparing to remove ${type} ${id} due to collision !!!`);
    console.log(`[Scene3D] Collision detected with ${type}: ${id}`);
    
    if (type === 'germ') {
      setGerms(prevGerms => prevGerms.filter(germ => germ.id !== id));
    } else if (type === 'dust') {
      setDustParticles(prevDust => prevDust.filter(dust => dust.id !== id));
    }
    // TODO: Add other collision effects (e.g., decrease lives, trigger Q&A)
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
          <GermManager
            oxyPosition={oxyPosition}
            onGermsChange={handleGermsChange}
            germs={germs}
          />
          <DustManager
            onDustChange={handleDustChange}
            dustParticles={dustParticles}
          />
          <CollisionManager
            oxyPosition={oxyPosition}
            germs={germs}
            dustParticles={dustParticles}
            onCollision={handleCollision}
          />
          {(Array.isArray(germs) ? germs : []).map(germ => (
            <Germ key={germ.id} position={germ.position} size={germ.size} />
          ))}
          {(Array.isArray(dustParticles) ? dustParticles : []).map(dust => (
            <DustParticle key={dust.id} position={dust.position} size={dust.size} />
          ))}
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