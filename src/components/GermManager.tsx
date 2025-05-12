import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoading } from './LoadingManager';
import * as THREE from 'three';

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140;
const OUT_OF_BOUNDS_Z = 160;
const MAX_GERMS = 20;
const SPAWN_INTERVAL = 1.5; // seconds
const INITIAL_SPAWN_DELAY = 1.5; // seconds

function randomXY(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1);
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomSpeed() {
  // Adjusted speed range (units per second)
  // return 17 + Math.random() * 12; // Old range: 17-29 units per second
  return 40 + Math.random() * 20; // Faster range: 40-60 units per second
}

function randomLifetime() {
  // Increased lifetime significantly
  return 240 + Math.random() * 60; // 240 to 300 seconds lifetime
}

function randomTargetAcrossTunnel(spawnXY: [number, number]): [number, number, number] {
  return [spawnXY[0], spawnXY[1], 140];
}

// Ensure this interface is exported
export interface GermInstance {
  id: string;
  position: [number, number, number];
  speed: number; // Units per second
  size: number;
  target: [number, number, number];
  timeAlive: number;
  maxLifetime: number; // seconds
}

interface GermManagerProps {
  oxyPosition: [number, number, number]; // Accept Oxy's position
  germs: GermInstance[]; // Accept the current list of germs
  onGermsChange: (updatedGerms: GermInstance[]) => void; // Callback to update state in parent
}

const GermManager: React.FC<GermManagerProps> = ({ germs, onGermsChange }) => {
  const [isReady, setIsReady] = useState(false); // Keep state for spawn readiness
  const { isLoading } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  const isFirstSpawn = useRef(true);

  // Effect to manage spawn readiness based on loading state
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        console.log('[GermManager] Now ready to spawn germs');
        setIsReady(true);
      }, INITIAL_SPAWN_DELAY * 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
      spawnTimer.current = 0;
      isFirstSpawn.current = true;
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    if (!isReady) return;

    // Ensure germs is always an array before proceeding
    if (!Array.isArray(germs)) {
      console.error('[GermManager] Error: germs prop is not an array!', germs);
      return; 
    }

    let currentGerms = [...germs];

    // 1. Move existing germs
    let movedGerms = currentGerms.map((germ, index) => {
      // --- Defensive Checks Start ---
      if (!germ || !germ.position || !Array.isArray(germ.position) || germ.position.length !== 3) {
        console.error('[GermManager] Invalid germ position:', germ);
        return germ; // Return original germ data if invalid to prevent crash
      }
      if (!germ.target || !Array.isArray(germ.target) || germ.target.length !== 3) {
        console.error('[GermManager] Invalid germ target:', germ);
        return germ;
      }
      if (typeof germ.speed !== 'number' || typeof germ.timeAlive !== 'number') {
        console.error('[GermManager] Invalid germ speed or timeAlive:', germ);
        return germ;
      }
      // --- Defensive Checks End ---

      const currentPos = new THREE.Vector3(...germ.position);
      const targetPos = new THREE.Vector3(...germ.target);
      const direction = new THREE.Vector3().subVectors(targetPos, currentPos);

      // Removed the snappedToTarget flag and the early return based on distance check.
      // Calculate movement regardless, ensure it doesn't overshoot.
      
      const remainingDistanceSq = direction.lengthSq();
      let finalPos = currentPos.clone(); // Start with the current position for the update

      // Only calculate movement if not already at the target (use epsilon for float comparison)
      if (remainingDistanceSq > 1e-6) { 
          direction.normalize();
          const moveDistance = germ.speed * delta;

          // Check if the intended move distance is greater than or equal to the remaining distance
          if (moveDistance * moveDistance >= remainingDistanceSq) {
              // If so, place the germ exactly at the target position for this frame
              finalPos.copy(targetPos);
          } else {
              // Otherwise, move the calculated distance along the direction vector
              finalPos.addScaledVector(direction, moveDistance);
          }
      }

      const finalTimeAlive = (typeof germ.timeAlive === 'number' ? germ.timeAlive : 0) + delta;

      return {
        ...germ,
        position: [finalPos.x, finalPos.y, finalPos.z] as [number, number, number], // Use finalPos
        timeAlive: finalTimeAlive
      };
    });

    // 2. Filter out of bounds / expired germs
    let filteredGerms = movedGerms.filter(germ => {
      if (!germ || typeof germ.timeAlive !== 'number' || typeof germ.maxLifetime !== 'number' || !Array.isArray(germ.position)) {
         console.error('[GermManager] Invalid germ data before filtering:', germ);
         return false;
      }
      const isOutOfBounds = germ.position[2] >= OUT_OF_BOUNDS_Z;
      const isExpired = germ.timeAlive >= germ.maxLifetime;
      
      if (isOutOfBounds) {
      }
      if (isExpired) {
      }

      return !isOutOfBounds && !isExpired;
    });

    // 3. Spawn new germs if needed
    spawnTimer.current += delta;
    let newGerms = [...filteredGerms];
    
    while (newGerms.length < MAX_GERMS && spawnTimer.current >= SPAWN_INTERVAL) {
      const [x, y] = randomXY(TUNNEL_RADIUS);
      // --- Create the new germ data --- 
      const newGerm: GermInstance = {
        id: `germ-${nextId.current++}`,
        position: [x, y, SPAWN_Z],
        speed: randomSpeed(),
        size: 1 + Math.random() * 0.5,
        target: randomTargetAcrossTunnel([x, y]),
        timeAlive: 0,
        maxLifetime: randomLifetime()
      };
      newGerms.push(newGerm);
      if (isFirstSpawn.current) {
        isFirstSpawn.current = false;
      }
      spawnTimer.current -= SPAWN_INTERVAL;
    }

    // 4. Call the callback with the final list
    onGermsChange(newGerms);
  });

  return null;
};

export default GermManager; 