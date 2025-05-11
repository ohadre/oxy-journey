'use client';

import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useLoading } from './LoadingManager';

export default function Tunnel() {
  const { loadedTextures } = useLoading();
  
  // Create and configure the texture
  const texture = useMemo(() => {
    console.log('[Tunnel] Creating and configuring texture');
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load('/textures/tunnel_tile.png');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2); // More natural tiling
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  
  useEffect(() => {
    console.log('[Tunnel] Component mounted');
    return () => console.log('[Tunnel] Component unmounted');
  }, []);

  // Animate the texture offset to simulate forward movement
  useFrame((_, delta) => {
    texture.offset.y += delta * 0.2; // Adjust speed as needed
    // Keep offset in [0,1] for numerical stability
    if (texture.offset.y > 1) texture.offset.y -= 1;
  });

  // Cylinder parameters
  const radius = 6;
  const height = 300;
  const radialSegments = 32;
  const heightSegments = 1;
  const openEnded = true;

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry
        args={[radius, radius, height, radialSegments, heightSegments, openEnded]}
      />
      <meshStandardMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
} 