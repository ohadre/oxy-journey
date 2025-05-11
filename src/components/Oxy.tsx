'use client';

import React, { forwardRef, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

// Define the key mapping type to match Scene3D
// type Controls = 'forward' | 'backward' | 'left' | 'right';
type Controls = 'forward' | 'backward' | 'left' | 'right';

interface OxyProps {
  worldSize: number; // This will be the tunnel radius
  onCollision?: (direction: 'left' | 'right' | 'top' | 'bottom') => void;
  initialPosition?: THREE.Vector3;
  onPositionChange?: (position: [number, number, number]) => void;
}

// Define the type for the imperative handle
export interface OxyRefType {
  getPosition: () => THREE.Vector3 | undefined;
}

const Oxy = forwardRef<THREE.Mesh, OxyProps>(({ worldSize, onCollision, initialPosition, onPositionChange }, ref) => {
  const texture = useTexture('/textures/oxy.png');
  const meshRef = useRef<THREE.Mesh>(null!);
  const velocityRef = useRef(new THREE.Vector3());
  const isNearBoundaryRef = useRef(false);
  
  const moveSpeed = 0.15;
  const maxSpeed = 0.2;
  const radius = 0.5; // Oxy's radius
  const tunnelRadius = 6; // Match Tunnel.tsx
  const boundaryThreshold = 1.0;

  const forward = useKeyboardControls(state => state.forward);
  const backward = useKeyboardControls(state => state.backward);
  const left = useKeyboardControls(state => state.left);
  const right = useKeyboardControls(state => state.right);
  const up = useKeyboardControls(state => state.up);
  const down = useKeyboardControls(state => state.down);

  useEffect(() => {
    if (meshRef.current && initialPosition) {
      meshRef.current.position.copy(initialPosition);
    }
  }, [initialPosition]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const velocity = velocityRef.current;
    const position = mesh.position;

    // Calculate desired movement direction
    const moveDirection = new THREE.Vector3();
    if (up) moveDirection.y += 1;
    if (down) moveDirection.y -= 1;
    if (left) moveDirection.x -= 1;
    if (right) moveDirection.x += 1;
    if (forward) moveDirection.z -= 1;
    if (backward) moveDirection.z += 1;

    // Normalize movement direction if moving diagonally
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }

    // Calculate distance from center in X-Y plane
    const xyDistance = Math.sqrt(position.x * position.x + position.y * position.y);
    const distanceToBoundary = tunnelRadius - radius - xyDistance;
    
    // Check if near boundary
    isNearBoundaryRef.current = distanceToBoundary < boundaryThreshold;

    // Apply movement with boundary constraints
    if (moveDirection.length() > 0) {
      // Calculate movement speed based on boundary proximity
      let currentSpeed = moveSpeed;
      if (isNearBoundaryRef.current) {
        // Gradually reduce speed as we approach the boundary
        const speedFactor = Math.max(0.1, distanceToBoundary / boundaryThreshold);
        currentSpeed *= speedFactor;
        
        // Prevent movement towards boundary
        const radialDirection = new THREE.Vector2(position.x, position.y).normalize();
        const dotProduct = moveDirection.x * radialDirection.x + moveDirection.y * radialDirection.y;
        if (dotProduct > 0) {
          moveDirection.x -= radialDirection.x * dotProduct;
          moveDirection.y -= radialDirection.y * dotProduct;
          moveDirection.normalize();
        }
      }

      // Update velocity with smooth acceleration
      velocity.x = THREE.MathUtils.lerp(velocity.x, moveDirection.x * currentSpeed, 0.2);
      velocity.y = THREE.MathUtils.lerp(velocity.y, moveDirection.y * currentSpeed, 0.2);
      velocity.z = THREE.MathUtils.lerp(velocity.z, moveDirection.z * currentSpeed, 0.2);
    } else {
      // Apply friction when no input
      velocity.multiplyScalar(0.9);
    }

    // Clamp velocity to max speed
    if (velocity.length() > maxSpeed) {
      velocity.normalize().multiplyScalar(maxSpeed);
    }

    // Update position
    position.add(velocity);

    // Strictly clamp to tunnel's circular cross-section (X, Y)
    const newXYDistance = Math.sqrt(position.x * position.x + position.y * position.y);
    if (newXYDistance > tunnelRadius - radius) {
      const scale = (tunnelRadius - radius) / newXYDistance;
      position.x *= scale;
      position.y *= scale;
      // Bounce off boundary
      velocity.x *= -0.5;
      velocity.y *= -0.5;
      onCollision?.('left');
    }

    // Clamp Z position to tunnel length
    const tunnelZMin = -150;
    const tunnelZMax = 150;
    if (position.z < tunnelZMin) {
      position.z = tunnelZMin;
      velocity.z *= -0.5;
      onCollision?.('bottom');
    } else if (position.z > tunnelZMax) {
      position.z = tunnelZMax;
      velocity.z *= -0.5;
      onCollision?.('top');
    }

    // Update position callback
    onPositionChange?.([position.x, position.y, position.z]);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        toneMapped={false}
      />
    </mesh>
  );
});

Oxy.displayName = "Oxy"; // Helpful for debugging

export { Oxy }; // Ensure it's a named export if default is not used, or make it default 