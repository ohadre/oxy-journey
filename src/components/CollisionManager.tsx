import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_RADIUS } from './EntityManager';

interface CollisionManagerProps {
  oxyPosition: [number, number, number];
  onCollision: () => void;
}

export const CollisionManager: React.FC<CollisionManagerProps> = ({
  oxyPosition,
  onCollision
}) => {
  const lastCollisionTime = useRef(0);
  const collisionCooldown = 2000; // 2 seconds cooldown between collisions

  useFrame(() => {
    const currentTime = Date.now();
    if (currentTime - lastCollisionTime.current < collisionCooldown) return;

    const oxyPos = new THREE.Vector3(...oxyPosition);
    const oxyRadius = 1.5; // Match Oxy.tsx radius

    // Check tunnel boundary collision only
    const xyDistance = Math.sqrt(oxyPos.x * oxyPos.x + oxyPos.y * oxyPos.y);
    if (xyDistance + oxyRadius > TUNNEL_RADIUS) {
      console.log('[CollisionManager] Tunnel boundary collision detected:', {
        position: oxyPos.toArray(),
        distance: xyDistance,
        radius: oxyRadius,
        tunnelRadius: TUNNEL_RADIUS,
        timeSinceLastCollision: currentTime - lastCollisionTime.current
      });
      onCollision();
      lastCollisionTime.current = currentTime;
    }
  });

  return null;
}; 