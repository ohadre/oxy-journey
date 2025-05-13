'use client';

import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Define the key mapping type to match Scene3D
// type Controls = 'forward' | 'backward' | 'left' | 'right';
type Controls = 'forward' | 'backward' | 'left' | 'right';

interface OxyProps {
  worldSize: number; // This will be the tunnel radius
  initialPosition?: THREE.Vector3;
  onPositionChange?: (pos: [number, number, number]) => void;
  gameState?: 'loading' | 'playing' | 'question_paused' | 'game_over';
  isInvincible?: boolean; // Add isInvincible prop
}

// Define the type for the imperative handle
export interface OxyRefType {
  getPosition: () => THREE.Vector3 | undefined;
}

const Oxy = forwardRef<THREE.Mesh, OxyProps>(({ worldSize, initialPosition, onPositionChange, gameState, isInvincible }, ref) => {
  const texture = useTexture('/textures/oxy.png');
  const velocityRef = useRef(new THREE.Vector3());
  
  const moveSpeed = 0.15;
  const maxSpeed = 0.2;
  const radius = 0.5; // Oxy's radius
  const tunnelRadius = 6; // Match Tunnel.tsx

  const forward = useKeyboardControls(state => state.forward);
  const backward = useKeyboardControls(state => state.backward);
  const left = useKeyboardControls(state => state.left);
  const right = useKeyboardControls(state => state.right);
  const up = useKeyboardControls(state => state.up);
  const down = useKeyboardControls(state => state.down);

  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current && initialPosition) {
      ref.current.position.copy(initialPosition);
    }
  }, [initialPosition, ref]);

  // Effect to update opacity based on invincibility
  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current && ref.current.material) {
      // Ensure material is of a type that supports opacity and we can modify it
      const material = ref.current.material as THREE.MeshBasicMaterial; 
      if (material) {
        material.opacity = isInvincible ? 0.5 : 1.0;
        material.needsUpdate = true; // Important for some material changes
      }
    }
  }, [isInvincible, ref]);

  useFrame(({ camera }, delta) => {
    if (!ref || typeof ref === 'function' || !ref.current) return;
    const mesh = ref.current;

    // Allow lookAt to work even if paused, but skip movement logic
    if (gameState && gameState !== 'playing') {
      if (mesh) {
        mesh.lookAt(camera.position);
      }
      return; 
    }

    // Use the selector pattern variables
    // const forward = getKeys('forward');
    // const backward = getKeys('backward');
    // const left = getKeys('left');
    // const right = getKeys('right');
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

    // Apply movement
    if (moveDirection.length() > 0) {
      // Update velocity with smooth acceleration
      velocity.x = THREE.MathUtils.lerp(velocity.x, moveDirection.x * moveSpeed, 0.2);
      velocity.y = THREE.MathUtils.lerp(velocity.y, moveDirection.y * moveSpeed, 0.2);
      velocity.z = THREE.MathUtils.lerp(velocity.z, moveDirection.z * moveSpeed, 0.2);
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

    // Clamp to tunnel boundaries
    const newXYDistance = Math.sqrt(position.x * position.x + position.y * position.y);
    if (newXYDistance > tunnelRadius - radius) {
      const scale = (tunnelRadius - radius) / newXYDistance;
      position.x *= scale;
      position.y *= scale;
      velocity.x *= -0.5;
      velocity.y *= -0.5;
    }

    // Clamp Z position to tunnel length
    const tunnelZMin = -150;
    const tunnelZMax = 150;
    if (position.z < tunnelZMin + radius) {
      position.z = tunnelZMin + radius;
      velocity.z = 0;
    }
    if (position.z > tunnelZMax - radius) {
      position.z = tunnelZMax - radius;
      velocity.z = 0;
    }

    // Clamp minimum distance to camera
    const minZ = camera.position.z - 2;
    if (position.z > minZ) {
      position.z = minZ;
      velocity.z = 0;
    }

    // Update mesh position
    mesh.position.copy(position);
    
    // Report position to parent if callback provided
    if (typeof onPositionChange === 'function') {
      onPositionChange([position.x, position.y, position.z]);
    }
    
    // Make Oxy always face the camera
    if (mesh) {
      mesh.lookAt(camera.position);
    }
  });

  return (
    <mesh ref={ref} position={initialPosition}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
});

Oxy.displayName = "Oxy"; // Helpful for debugging

export { Oxy }; // Ensure it's a named export if default is not used, or make it default 