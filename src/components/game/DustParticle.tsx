import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

interface DustParticleProps {
  position: [number, number, number];
  size?: number;
  texturePath?: string;
}

const DustParticle: React.FC<DustParticleProps> = ({ 
  position = [0, 0, 0], 
  size = 0.5, 
  texturePath = '/textures/dust.png'
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const texture = useTexture(texturePath, (loadedTex) => {
    if (loadedTex instanceof THREE.Texture) {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
    }
  });

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {texture instanceof THREE.Texture ? (
        <>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial 
            map={texture}
            transparent
            alphaTest={0.5} // Adjust if texture has lots of transparency
            toneMapped={false} 
          />
        </>
      ) : (
        <>
          <sphereGeometry args={[size / 2, 8, 8]} />
          <meshStandardMaterial color="grey" />
        </>
      )}
    </mesh>
  );
};

export default DustParticle; 