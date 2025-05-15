import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface KnowledgeProps {
  position: [number, number, number];
  size: number;
}

const Knowledge: React.FC<KnowledgeProps> = ({ position = [0, 0, 0], size = 0.75 }) => { // Adjusted default size slightly for visibility
  const meshRef = useRef<THREE.Mesh>(null!);

  const texture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load('/textures/knowledge.png'); 
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
        side={THREE.DoubleSide} 
        alphaTest={0.1} 
        toneMapped={false} 
      />
    </mesh>
  );
};

export default Knowledge; 