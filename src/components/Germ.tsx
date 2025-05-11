import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLoading } from './LoadingManager';

interface GermProps {
  position?: [number, number, number];
  size?: number;
  speed?: number; // units per frame
  target?: [number, number, number];
}

const Germ: React.FC<GermProps> = ({ position = [0, 0, 0], size = 1, speed = 0.1, target }) => {
  const { loadedTextures } = useLoading();
  
  // Create texture manually instead of using useTexture
  const texture = useMemo(() => {
    console.log('[Germ] Creating texture');
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load('/textures/germ.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  
  const meshRef = useRef<THREE.Mesh>(null!);
  const positionRef = useRef<THREE.Vector3>(new THREE.Vector3(...position));

  // For random drift
  const driftPhase = useRef({ x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2 });

  useFrame(({ camera, clock }) => {
    if (meshRef.current && target) {
      // Move toward target with lerp
      const targetVec = new THREE.Vector3(...target);
      // Add random drift to direction
      const t = clock.getElapsedTime();
      const driftX = Math.sin(t + driftPhase.current.x) * 0.3;
      const driftY = Math.cos(t + driftPhase.current.y) * 0.3;
      targetVec.x += driftX;
      targetVec.y += driftY;
      // Lerp toward the (drifting) target
      positionRef.current.lerp(targetVec, speed * 0.1); // speed controls lerp rate
      meshRef.current.position.copy(positionRef.current);
      // Always face the camera
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        toneMapped={false}
      />
    </mesh>
  );
};

export default Germ; 