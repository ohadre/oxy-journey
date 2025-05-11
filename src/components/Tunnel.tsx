'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Tunnel: React.FC = () => {
  const textureRef = useRef<THREE.Texture | null>(null);
  const isInitialized = useRef(false);

  // Use the correct tunnel tile texture with underscore
  const texture = useMemo(() => {
    const texture = new THREE.TextureLoader().load('/textures/tunnel_tile.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 8);
    textureRef.current = texture;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, []);

  useFrame((_, delta) => {
    if (!textureRef.current || !isInitialized.current) return;
    const speed = 0.1;
    textureRef.current.offset.y += speed * delta;
  });

  useEffect(() => {
    isInitialized.current = true;
  }, []);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[6, 6, 300, 32, 1, true]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default Tunnel; 