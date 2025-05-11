'use client';

import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';

export default function Tunnel() {
  // Load the texture
  const texture = useLoader(THREE.TextureLoader, '/textures/tunnel_tile.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2); // More natural tiling

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
      />
    </mesh>
  );
} 