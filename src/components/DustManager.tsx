import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Dust from './Dust';
import { useLoading } from './LoadingManager';
import * as THREE from 'three';

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140;
const OUT_OF_BOUNDS_Z = 160;
const MAX_DUSTS = 6;
const SPAWN_INTERVAL = 3; // seconds
const INITIAL_SPAWN_DELAY = 1.5; // seconds delay after loading before first spawn

function randomXY(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1.5); // -1.5 for margin
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomSpeed() {
  return 0.08 + Math.random() * 0.07; // 0.08 to 0.15 units per frame
}

function randomLifetime() {
  return 15 + Math.random() * 10; // 15 to 25 seconds lifetime
}

function randomTargetAcrossTunnel(spawnXY: [number, number]): [number, number, number] {
  return [spawnXY[0], spawnXY[1], 140];
}

export interface DustInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  target: [number, number, number];
  timeAlive: number;
  maxLifetime: number;
}

const DustManager: React.FC = () => {
  const [dusts, setDusts] = useState<DustInstance[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { isLoading } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  const isFirstSpawn = useRef(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, INITIAL_SPAWN_DELAY * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    if (!isReady) return;
    setDusts(prev => {
      // Move dusts with slower speed and update lifetime
      const moved = prev.map(dust => {
        const currentPos = new THREE.Vector3(...dust.position);
        const targetPos = new THREE.Vector3(...dust.target);
        const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
        const moveDistance = dust.speed * delta * 10; // Reduced scale factor for slower movement
        currentPos.addScaledVector(direction, moveDistance);
        
        return {
          ...dust,
          position: [currentPos.x, currentPos.y, currentPos.z] as [number, number, number],
          timeAlive: dust.timeAlive + delta
        };
      });
      
      // Remove dusts that are out of bounds OR have exceeded their lifetime
      let filtered = moved.filter(dust => {
        const isOutOfBounds = dust.position[2] >= OUT_OF_BOUNDS_Z;
        const isExpired = dust.timeAlive >= dust.maxLifetime;
        return !isOutOfBounds && !isExpired;
      });
      
      if (filtered.length !== moved.length) {
        console.log(`[DustManager] Removed ${moved.length - filtered.length} dusts (out of bounds or expired)`);
      }
      
      spawnTimer.current += delta;
      let spawnCount = 0;
      while (filtered.length < MAX_DUSTS && spawnTimer.current >= SPAWN_INTERVAL) {
        const [x, y] = randomXY(TUNNEL_RADIUS);
        filtered.push({
          id: `dust-${nextId.current++}`,
          position: [x, y, SPAWN_Z],
          speed: randomSpeed(),
          size: 0.7 + Math.random() * 0.4,
          target: randomTargetAcrossTunnel([x, y]),
          timeAlive: 0,
          maxLifetime: randomLifetime()
        });
        spawnCount++;
        spawnTimer.current -= SPAWN_INTERVAL;
      }
      if (spawnCount > 0) {
        console.log(`[DustManager] Spawned ${spawnCount} dusts this frame. Timer: ${spawnTimer.current.toFixed(2)}. Dusts now: ${filtered.length}`);
      } else {
        console.log(`[DustManager] No spawn. Timer: ${spawnTimer.current.toFixed(2)}. Dusts: ${filtered.length}`);
      }
      return filtered;
    });
  });

  return (
    <>
      {dusts.map(dust => (
        <Dust key={dust.id} position={dust.position} speed={dust.speed} size={dust.size} target={dust.target} />
      ))}
    </>
  );
};

export default DustManager; 