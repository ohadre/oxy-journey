import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLoading } from './LoadingManager';

// Common configuration for all entities
export const TUNNEL_RADIUS = 6;
export const SPAWN_Z = -140;
export const OUT_OF_BOUNDS_Z = 160;

// Base interface for entity instances
export interface EntityInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  target: [number, number, number];
  timeAlive: number;
  maxLifetime: number;
}

// Props for the base manager
export interface EntityManagerProps {
  oxyPosition: [number, number, number];
  maxEntities: number;
  spawnInterval: number;
  initialSpawnDelay: number;
  entityType: 'germ' | 'dust';
  onEntitiesUpdate?: (entities: EntityInstance[]) => void;
}

// Helper functions
export function randomXY(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1.5); // -1.5 for margin
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

export function randomSpeed(): number {
  return 0.05 + Math.random() * 0.1; // 0.05 to 0.15
}

export function randomLifetime(): number {
  return 12 + Math.random() * 8; // 12 to 20 seconds
}

export function randomTargetAcrossTunnel(startPos: [number, number]): [number, number, number] {
  const [x, y] = randomXY(TUNNEL_RADIUS);
  return [x, y, OUT_OF_BOUNDS_Z];
}

// Base manager class
export function EntityManager<T extends EntityInstance>({
  oxyPosition,
  maxEntities,
  spawnInterval,
  initialSpawnDelay,
  entityType,
  renderEntity,
  onEntitiesUpdate
}: EntityManagerProps & {
  renderEntity: (entity: T) => React.ReactNode;
}) {
  const [entities, setEntities] = useState<T[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { isLoading } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);
  const isFirstSpawn = useRef(true);

  // Set ready state after loading completes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, initialSpawnDelay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, initialSpawnDelay]);

  useFrame((_, delta) => {
    if (!isReady) return;

    setEntities(prev => {
      // Move entities and update lifetime
      const moved = prev.map(entity => {
        const currentPos = new THREE.Vector3(...entity.position);
        const targetPos = new THREE.Vector3(...entity.target);
        const direction = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
        const moveDistance = entity.speed * delta * 10;
        currentPos.addScaledVector(direction, moveDistance);
        
        return {
          ...entity,
          position: [currentPos.x, currentPos.y, currentPos.z] as [number, number, number],
          timeAlive: entity.timeAlive + delta
        };
      });
      
      // Remove entities that are out of bounds or expired
      let filtered = moved.filter(entity => {
        const isOutOfBounds = entity.position[2] >= OUT_OF_BOUNDS_Z;
        const isExpired = entity.timeAlive >= entity.maxLifetime;
        return !isOutOfBounds && !isExpired;
      });
      
      // Timer-based spawning
      spawnTimer.current += delta;
      let spawnCount = 0;
      while (filtered.length < maxEntities && spawnTimer.current >= spawnInterval) {
        const [x, y] = randomXY(TUNNEL_RADIUS);
        const newEntity = {
          id: `${entityType}-${nextId.current++}`,
          position: [x, y, SPAWN_Z],
          speed: randomSpeed(),
          size: entityType === 'germ' ? 1 + Math.random() * 0.5 : 0.7 + Math.random() * 0.4,
          target: randomTargetAcrossTunnel([x, y]),
          timeAlive: 0,
          maxLifetime: randomLifetime()
        } as T;
        
        filtered.push(newEntity);
        spawnCount++;
        spawnTimer.current -= spawnInterval;
      }
      
      // After updating entities, call onEntitiesUpdate if provided
      if (onEntitiesUpdate) {
        onEntitiesUpdate(filtered);
      }
      return filtered;
    });
  });

  return (
    <>
      {entities.map(entity => renderEntity(entity))}
    </>
  );
} 