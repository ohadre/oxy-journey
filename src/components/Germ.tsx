import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GermProps {
  position: [number, number, number];
  size: number;
}

const Germ: React.FC<GermProps> = ({ position = [0, 0, 0], size = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const texture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load('/textures/germ.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(({ camera }) => {
    if (meshRef.current) {
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