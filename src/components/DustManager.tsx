import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoading } from './LoadingManager';
import * as THREE from 'three';

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140;
const OUT_OF_BOUNDS_Z = 160;
const MAX_DUST = 15; // Define max dust particles
const SPAWN_INTERVAL = 1.0; // Define spawn interval (seconds)
const INITIAL_SPAWN_DELAY = 2.0; // seconds delay after loading before first spawn

function randomXY(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1.0); // Adjusted margin slightly
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomDustSpeed() {
  // Adjusted speed range (units per second, similar to germs but maybe slightly slower)
  return 30 + Math.random() * 15; // 30-45 units per second 
}

function randomDustLifetime() {
  // Using a longer lifetime, similar to germs
  return 200 + Math.random() * 100; // 200 to 300 seconds lifetime
}

// Target doesn't seem strictly necessary if just moving down Z axis
// function randomTargetAcrossTunnel(spawnXY: [number, number]): [number, number, number] {
//   return [spawnXY[0], spawnXY[1], 140];
// }

// Ensure this interface is exported
export interface DustInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  // target: [number, number, number]; // Removed target if not needed
  timeAlive: number;
  maxLifetime: number;
}

// Define props interface
interface DustManagerProps {
  dustParticles: DustInstance[];
  onDustChange: (updatedDust: DustInstance[]) => void;
  gameState: 'loading' | 'playing' | 'question_paused' | 'game_over' | 'level_complete_debug' | 'won'; // Add gameState prop
}

const DustManager: React.FC<DustManagerProps> = ({ dustParticles, onDustChange, gameState }) => {
  // Removed internal state: const [dusts, setDusts] = useState<DustInstance[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { isLoading } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  // Removed isFirstSpawn ref as it wasn't used in the cleaned version

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, INITIAL_SPAWN_DELAY * 1000);
      return () => clearTimeout(timer);
    } else {
      // Reset state if loading restarts
      setIsReady(false);
      spawnTimer.current = 0;
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    if (gameState !== 'playing') return; // Pause if not playing
    if (!isReady) return;

    // Ensure dustParticles is always an array before proceeding
    if (!Array.isArray(dustParticles)) {
      console.error('[DustManager] Error: dustParticles prop is not an array!', dustParticles);
      return; 
    }

    let currentDust = [...dustParticles];

    // 1. Move existing dust particles
    let movedDust = currentDust.map((dust) => {
      // --- Defensive Checks Start ---
      if (!dust || !dust.position || !Array.isArray(dust.position) || dust.position.length !== 3) {
        console.error('[DustManager] Invalid dust position:', dust);
        return dust; 
      }
      if (typeof dust.speed !== 'number' || typeof dust.timeAlive !== 'number') {
        console.error('[DustManager] Invalid dust speed or timeAlive:', dust);
        return dust;
      }
      // --- Defensive Checks End ---

      // Simplified Z-axis movement (assuming dust drifts down the tunnel)
      const newZ = dust.position[2] + dust.speed * delta;
      const finalPos: [number, number, number] = [dust.position[0], dust.position[1], newZ];
      const finalTimeAlive = dust.timeAlive + delta;

      return {
        ...dust,
        position: finalPos,
        timeAlive: finalTimeAlive
      };
    });
    
    // 2. Filter out of bounds / expired dust
    let filteredDust = movedDust.filter(dust => {
      if (!dust || typeof dust.timeAlive !== 'number' || typeof dust.maxLifetime !== 'number' || !Array.isArray(dust.position)) {
         console.error('[DustManager] Invalid dust data before filtering:', dust);
         return false;
      }
      const isOutOfBounds = dust.position[2] >= OUT_OF_BOUNDS_Z;
      const isExpired = dust.timeAlive >= dust.maxLifetime;
      return !isOutOfBounds && !isExpired;
    });
    
    // 3. Spawn new dust if needed
    spawnTimer.current += delta;
    let newDustParticles = [...filteredDust];
    while (newDustParticles.length < MAX_DUST && spawnTimer.current >= SPAWN_INTERVAL) {
      const [x, y] = randomXY(TUNNEL_RADIUS);
      const newDust: DustInstance = {
        id: `dust-${nextId.current++}`,
        position: [x, y, SPAWN_Z],
        speed: randomDustSpeed(),
        size: 0.5 + Math.random() * 0.5, // Adjusted size range
        // target: randomTargetAcrossTunnel([x, y]), // Removed target
        timeAlive: 0,
        maxLifetime: randomDustLifetime()
      };
      newDustParticles.push(newDust);
      spawnTimer.current -= SPAWN_INTERVAL;
    }

    // 4. Call the callback with the final list
    onDustChange(newDustParticles);
  });

  return null; // Does not render anything directly
};

export default DustManager; 