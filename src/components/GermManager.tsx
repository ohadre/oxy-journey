import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Germ from './Germ';
import { useLoading } from './LoadingManager';
import * as THREE from 'three';

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140; // Far end of the tunnel
const OUT_OF_BOUNDS_Z = 160; // Remove germs past this Z
const MAX_GERMS = 8;
const SPAWN_INTERVAL = 2; // seconds
const INITIAL_SPAWN_DELAY = 1.5; // seconds delay after loading before first spawn

function randomXY(radius: number): [number, number] {
  // Random point in a circle
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1); // -1 for margin
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomSpeed() {
  return 0.1 + Math.random() * 0.08; // 0.1 to 0.18 units per frame
}

function randomLifetime() {
  return 12 + Math.random() * 8; // 12 to 20 seconds lifetime
}

function randomTargetAcrossTunnel(spawnXY: [number, number]): [number, number, number] {
  // Target is same X/Y, but at the far end (z = +140)
  return [spawnXY[0], spawnXY[1], 140];
}

export interface GermInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  target: [number, number, number];
  timeAlive: number;
  maxLifetime: number;
}

const GermManager: React.FC = () => {
  const [germs, setGerms] = useState<GermInstance[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { isLoading, loadedTextures } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  const isFirstSpawn = useRef(true);

  // Set ready state after loading completes
  useEffect(() => {
    if (!isLoading) {
      // Add a delay before allowing spawns
      console.log('[GermManager] Loading complete, setting up spawn timer');
      const timer = setTimeout(() => {
        console.log('[GermManager] Now ready to spawn germs');
        setIsReady(true);
      }, INITIAL_SPAWN_DELAY * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    // Only process spawns if loading is complete and ready state is true
    if (!isReady) return;

    setGerms(prev => {
      // Move germs with slower speed and update lifetime
      const moved = prev.map(germ => {
        const currentPos = new THREE.Vector3(...germ.position);
        const targetPos = new THREE.Vector3(...germ.target);
        const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
        const moveDistance = germ.speed * delta * 10; // Reduced scale factor for slower movement
        currentPos.addScaledVector(direction, moveDistance);
        
        return {
          ...germ,
          position: [currentPos.x, currentPos.y, currentPos.z] as [number, number, number],
          timeAlive: germ.timeAlive + delta
        };
      });
      
      // Remove germs that are out of bounds OR have exceeded their lifetime
      let filtered = moved.filter(germ => {
        const isOutOfBounds = germ.position[2] >= OUT_OF_BOUNDS_Z;
        const isExpired = germ.timeAlive >= germ.maxLifetime;
        return !isOutOfBounds && !isExpired;
      });
      
      if (filtered.length !== moved.length) {
        console.log(`[GermManager] Removed ${moved.length - filtered.length} germs (out of bounds or expired)`);
      }
      
      // Timer-based spawning
      spawnTimer.current += delta;
      let spawnCount = 0;
      while (filtered.length < MAX_GERMS && spawnTimer.current >= SPAWN_INTERVAL) {
        const [x, y] = randomXY(TUNNEL_RADIUS);
        filtered.push({
          id: `germ-${nextId.current++}`,
          position: [x, y, SPAWN_Z],
          speed: randomSpeed(),
          size: 1 + Math.random() * 0.5,
          target: randomTargetAcrossTunnel([x, y]),
          timeAlive: 0,
          maxLifetime: randomLifetime()
        });
        spawnCount++;
        if (isFirstSpawn.current) {
          console.log('[GermManager] First germ spawned');
          isFirstSpawn.current = false;
        }
        spawnTimer.current -= SPAWN_INTERVAL;
      }
      if (spawnCount > 0) {
        console.log(`[GermManager] Spawned ${spawnCount} germs this frame. Timer: ${spawnTimer.current.toFixed(2)}. Germs now: ${filtered.length}`);
      } else {
        console.log(`[GermManager] No spawn. Timer: ${spawnTimer.current.toFixed(2)}. Germs: ${filtered.length}`);
      }
      return filtered;
    });
  });

  return (
    <>
      {germs.map(germ => (
        <Germ key={germ.id} position={germ.position} speed={germ.speed} size={germ.size} target={germ.target} />
      ))}
    </>
  );
};

export default GermManager; 