import { useRef } from 'react';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorldBoundariesProps {
  size: number;
  onCollision?: (direction: 'left' | 'right' | 'top' | 'bottom') => void;
}

export const WorldBoundaries: React.FC<WorldBoundariesProps> = ({ size, onCollision }) => {
  const boundariesRef = useRef<THREE.Group>(null);

  // Define boundary positions
  const halfSize = size / 2;
  const boundaryThickness = 0.1;

  return (
    <group ref={boundariesRef}>
      {/* Left boundary */}
      <Box
        position={[-halfSize, 0, 0]}
        args={[boundaryThickness, size, size]}
        visible={false}
      />
      {/* Right boundary */}
      <Box
        position={[halfSize, 0, 0]}
        args={[boundaryThickness, size, size]}
        visible={false}
      />
      {/* Top boundary */}
      <Box
        position={[0, 0, -halfSize]}
        args={[size, size, boundaryThickness]}
        visible={false}
      />
      {/* Bottom boundary */}
      <Box
        position={[0, 0, halfSize]}
        args={[size, size, boundaryThickness]}
        visible={false}
      />
    </group>
  );
}; 