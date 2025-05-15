import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoading } from './LoadingManager';
// import * as THREE from 'three'; // Not strictly needed if not using THREE.Vector3 etc.

const TUNNEL_RADIUS = 6;
const SPAWN_Z = -140;
const OUT_OF_BOUNDS_Z = 160;
const MAX_KNOWLEDGE = 5; // Updated as per user feedback
const SPAWN_INTERVAL = 0.875; // Approx 20% longer interval than Dust's 0.7 (0.7 / 0.8 or 0.7 * 1.25)
const INITIAL_SPAWN_DELAY = 2.5; // Slightly longer initial delay

function randomXY(radius: number): [number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * (radius - 1.0); 
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

function randomKnowledgeSpeed() {
  // Approx 60% of Dust's speed (Dust: 36-54)
  // New range: 22-32 (avg 27, which is 60% of Dust's avg 45)
  return 22 + Math.random() * 10;
}

function randomKnowledgeLifetime() {
  // Same lifetime as Dust for now, can be tuned later
  return 200 + Math.random() * 100; // 200 to 300 seconds lifetime
}

export interface KnowledgeInstance {
  id: string;
  position: [number, number, number];
  speed: number;
  size: number;
  timeAlive: number;
  maxLifetime: number;
}

interface KnowledgeManagerProps {
  knowledgeItems: KnowledgeInstance[];
  onKnowledgeChange: (updatedKnowledge: KnowledgeInstance[]) => void;
  gameState: 'loading' | 'playing' | 'question_paused' | 'game_over' | 'level_complete_debug' | 'won' | 'instructions';
}

const KnowledgeManager: React.FC<KnowledgeManagerProps> = ({ knowledgeItems, onKnowledgeChange, gameState }) => {
  const [isReady, setIsReady] = useState(false);
  const { isLoading } = useLoading();
  const nextId = useRef(Date.now());
  const spawnTimer = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true);
        console.log('[KnowledgeManager] Now ready to spawn knowledge items');
      }, INITIAL_SPAWN_DELAY * 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
      spawnTimer.current = 0;
    }
  }, [isLoading]);

  useFrame((_, delta) => {
    if (gameState !== 'playing') return;
    if (!isReady) return;

    if (!Array.isArray(knowledgeItems)) {
      console.error('[KnowledgeManager] Error: knowledgeItems prop is not an array!', knowledgeItems);
      return; 
    }

    let currentKnowledge = [...knowledgeItems];

    let movedKnowledge = currentKnowledge.map((item) => {
      if (!item || !item.position || !Array.isArray(item.position) || item.position.length !== 3) {
        console.error('[KnowledgeManager] Invalid knowledge item position:', item);
        return item; 
      }
      if (typeof item.speed !== 'number' || typeof item.timeAlive !== 'number') {
        console.error('[KnowledgeManager] Invalid knowledge item speed or timeAlive:', item);
        return item;
      }

      const newZ = item.position[2] + item.speed * delta;
      const finalPos: [number, number, number] = [item.position[0], item.position[1], newZ];
      const finalTimeAlive = item.timeAlive + delta;

      return {
        ...item,
        position: finalPos,
        timeAlive: finalTimeAlive
      };
    });
    
    let filteredKnowledge = movedKnowledge.filter(item => {
      if (!item || typeof item.timeAlive !== 'number' || typeof item.maxLifetime !== 'number' || !Array.isArray(item.position)) {
         console.error('[KnowledgeManager] Invalid knowledge item data before filtering:', item);
         return false;
      }
      const isOutOfBounds = item.position[2] >= OUT_OF_BOUNDS_Z;
      const isExpired = item.timeAlive >= item.maxLifetime;
      return !isOutOfBounds && !isExpired;
    });
    
    spawnTimer.current += delta;
    let newKnowledgeItems = [...filteredKnowledge];
    while (newKnowledgeItems.length < MAX_KNOWLEDGE && spawnTimer.current >= SPAWN_INTERVAL) {
      const [x, y] = randomXY(TUNNEL_RADIUS);
      const newItem: KnowledgeInstance = {
        id: `knowledge-${nextId.current++}`,
        position: [x, y, SPAWN_Z],
        speed: randomKnowledgeSpeed(),
        size: 0.75 + Math.random() * 0.25, // Size range 0.75 to 1.0
        timeAlive: 0,
        maxLifetime: randomKnowledgeLifetime()
      };
      newKnowledgeItems.push(newItem);
      spawnTimer.current -= SPAWN_INTERVAL;
    }

    onKnowledgeChange(newKnowledgeItems);
  });

  return null;
};

export default KnowledgeManager; 