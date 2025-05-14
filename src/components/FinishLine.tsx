'use client';

import React from 'react';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';

interface FinishLineProps {
  position: [number, number, number];
  radius?: number; // Radius of the torus tube
  tubeRadius?: number; // Radius of the torus itself
  color?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
}

const FinishLine: React.FC<FinishLineProps> = ({
  position,
  radius = 5.5, // Slightly smaller than tunnel radius (6) to be visible inside
  tubeRadius = 0.3,
  color = 'gold',
  emissiveColor = 'gold',
  emissiveIntensity = 1.5,
}) => {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}> {/* Rotate to face the camera coming along Z */}
      <Torus args={[radius, tubeRadius, 16, 100]}>
        <meshStandardMaterial 
          color={color} 
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide} // Ensure it's visible from both sides if needed
        />
      </Torus>
    </mesh>
  );
};

export default FinishLine; 