import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GermInstance } from './GermManager'; // Import GermInstance type

// Removed import { TUNNEL_RADIUS } from './EntityManager';

interface CollisionManagerProps {
  oxyPosition: [number, number, number];
  germs: GermInstance[]; // Add germs array prop
  onCollision: (germId: string) => void; // Modify onCollision to accept germId
}

export const CollisionManager: React.FC<CollisionManagerProps> = ({
  oxyPosition,
  germs, // Destructure germs prop
  onCollision
}) => {
  const lastCollisionTime = useRef(0);
  const collisionCooldown = 500; // Cooldown in milliseconds (e.g., 0.5 seconds)
  const oxyRadius = 0.5; // Oxy's radius

  useFrame(() => {
    // Add check to ensure germs is an array
    if (!Array.isArray(germs)) {
       // It might be undefined briefly on init, don't log error unless debugging
       // console.error('[CollisionManager] Error: germs prop is not an array!', germs);
       return; 
    }

    const currentTime = Date.now();
    // Check if cooldown period has passed since the last collision
    if (currentTime - lastCollisionTime.current < collisionCooldown) {
      return; // Skip check if still in cooldown
    }

    const oxyPos = new THREE.Vector3(...oxyPosition);

    // Iterate through each germ to check for collision
    for (const germ of germs) {
      const germPos = new THREE.Vector3(...germ.position);
      const distance = oxyPos.distanceTo(germPos);

      const germRadius = germ.size * 0.5;
      const combinedRadius = oxyRadius + germRadius;

      // --- Add Logging Start ---
      // Log details for potentially colliding germs
      if (distance < combinedRadius + 5) { // Log if potentially close (within 5 units)
         console.log(`[CollisionManager] Checking Germ ${germ.id}: Dist: ${distance.toFixed(2)}, CombinedRadius: ${combinedRadius.toFixed(2)} (OxyPos: [${oxyPos.x.toFixed(2)}, ${oxyPos.y.toFixed(2)}, ${oxyPos.z.toFixed(2)}], GermPos: [${germPos.x.toFixed(2)}, ${germPos.y.toFixed(2)}, ${germPos.z.toFixed(2)}])`);
      }
      // --- Add Logging End ---

      // Check for overlap
      if (distance < combinedRadius) {
        console.log(`[CollisionManager] Collision detected! Oxy at ${oxyPos.toArray().map(n => n.toFixed(2))}, Germ ${germ.id} at ${germPos.toArray().map(n => n.toFixed(2))}. Dist: ${distance.toFixed(2)}, Combined Radius: ${combinedRadius.toFixed(2)}`);
        onCollision(germ.id); // Call the callback with the collided germ's ID
        lastCollisionTime.current = currentTime; // Update last collision time
        return; // Exit the loop and frame check after the first collision
      }
    }

    // --- Removed old tunnel boundary collision logic ---
  });

  return null; // This component does not render anything
}; 