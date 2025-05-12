import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DustParticleProps {
  position: [number, number, number];
  size: number;
}

const DustParticle: React.FC<DustParticleProps> = ({ position = [0, 0, 0], size = 0.5 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Load the dust texture
  const texture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    // Assuming the texture is preloaded by LoadingManager
    const tex = textureLoader.load('/textures/dust.png'); 
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Make the plane face the camera
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Use PlaneGeometry for textured billboard effect */}
      <planeGeometry args={[size, size]} /> 
      <meshBasicMaterial 
        map={texture}
        color="#FFFFFF" // Start with white, texture will provide color
        transparent // Enable transparency for the PNG
        side={THREE.DoubleSide} // Render both sides just in case
        alphaTest={0.1} // Adjust if needed to clip transparent edges
        toneMapped={false} // Ensure texture colors aren't affected by scene tone mapping
      />
    </mesh>
  );
};

export default DustParticle; 