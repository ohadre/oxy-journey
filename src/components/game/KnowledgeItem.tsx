import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

interface KnowledgeItemProps {
  position: [number, number, number];
  size?: number;
  texturePath?: string; // Optional: if we want to use a '?' texture
}

const KnowledgeItem: React.FC<KnowledgeItemProps> = ({ 
  position = [0, 0, 0], 
  size = 0.8, 
  texturePath = '/textures/knowledge.png' // Default to the new knowledge texture
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Attempt to load texture, fallback if it fails or not provided
  const texture = useTexture(texturePath, (loadedTex) => {
    if (loadedTex instanceof THREE.Texture) {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
    }
  });

  useFrame(({ camera }) => {
    if (meshRef.current) {
      // Make the item face the camera (like a sprite)
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
            toneMapped={false} 
          />
        </>
      ) : (
        // Fallback to a simple sphere if texture fails or is not preferred
        <>
          <sphereGeometry args={[size / 2, 16, 16]} />
          <meshStandardMaterial color="gold" />
        </>
      )}
    </mesh>
  );
};

export default KnowledgeItem; 