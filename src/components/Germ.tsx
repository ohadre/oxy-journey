import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface GermProps {
  position?: [number, number, number];
  size?: number;
  speed?: number; // units per frame
}

const Germ: React.FC<GermProps> = ({ position = [0, 0, 0], size = 1, speed = 0.1 }) => {
  const texture = useTexture('/textures/germ.png');
  const meshRef = useRef<THREE.Mesh>(null!);
  const positionRef = useRef<THREE.Vector3>(new THREE.Vector3(...position));

  // For random drift
  const driftPhase = useRef({ x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2 });

  useFrame(({ camera, clock }) => {
    if (meshRef.current) {
      // Move germ along +Z axis
      positionRef.current.z += speed;
      // Add smooth random drift in X and Y
      const t = clock.getElapsedTime();
      positionRef.current.x = position[0] + Math.sin(t + driftPhase.current.x) * 0.5;
      positionRef.current.y = position[1] + Math.cos(t + driftPhase.current.y) * 0.5;
      meshRef.current.position.copy(positionRef.current);
      // Always face the camera
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

export default Germ; 