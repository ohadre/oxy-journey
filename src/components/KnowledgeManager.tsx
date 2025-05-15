// src/components/KnowledgeManager.tsx
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { KnowledgeInstance } from '../types/game.types'; // Fixed import path

// Constants for Knowledge Object behavior (can be tuned)
const MAX_KNOWLEDGE_OBJECTS = 7; // Maximum number of knowledge objects on screen
const SPAWN_INTERVAL_KO = 5000; // Spawn a new knowledge object every 5 seconds (in milliseconds)
const SPAWN_Z_KO = -140;        // Initial Z position for new knowledge objects (far end of tunnel)
const MOVEMENT_SPEED_KO = 13;   // Units per second (Increased from 10)
const OUT_OF_BOUNDS_Z_KO = 160; // Z position at which objects are despawned (near player start)
const KNOWLEDGE_OBJECT_SIZE = 1.5; // Default size for knowledge objects
const KNOWLEDGE_OBJECT_LIFETIME = (OUT_OF_BOUNDS_Z_KO - SPAWN_Z_KO) / MOVEMENT_SPEED_KO * 1000 * 1.2; // Max time to live (ms), bit more than travel time

export interface KnowledgeManagerProps {
  knowledgeObjects: KnowledgeInstance[];
  onKnowledgeObjectsChange: (knowledgeObjects: KnowledgeInstance[]) => void;
  gameState: 'loading' | 'playing' | 'question_paused' | 'game_over' | 'won' | 'instructions'; // To control spawning
  gameSessionId: number; // Added for unique ID generation
}

const KnowledgeManager: React.FC<KnowledgeManagerProps> = ({
  knowledgeObjects,
  onKnowledgeObjectsChange,
  gameState,
  gameSessionId
}) => {
  const spawnTimerRef = useRef(0);
  const nextIdRef = useRef(0);

  useFrame((state, delta) => {
    if (gameState !== 'playing') {
      spawnTimerRef.current = 0; // Reset spawn timer if game is not playing
      return; // Don't spawn or move if not in 'playing' state
    }

    const newKnowledgeObjects = knowledgeObjects
      .map(ko => ({
        ...ko,
        position: [
          ko.position[0],
          ko.position[1],
          ko.position[2] + MOVEMENT_SPEED_KO * delta, // Move along Z towards player
        ] as [number, number, number],
        timeAlive: (ko.timeAlive || 0) + delta * 1000,
      }))
      .filter(ko => ko.position[2] < OUT_OF_BOUNDS_Z_KO && (ko.timeAlive || 0) < KNOWLEDGE_OBJECT_LIFETIME);

    // Spawning logic
    spawnTimerRef.current += delta * 1000; // Increment timer by milliseconds

    if (newKnowledgeObjects.length < MAX_KNOWLEDGE_OBJECTS && spawnTimerRef.current >= SPAWN_INTERVAL_KO) {
      spawnTimerRef.current = 0; // Reset timer

      // Simple spawn: random X within a range, fixed Y for now
      const randomX = (Math.random() - 0.5) * 8; // Example range for X: -4 to 4
      const randomY = Math.random() * 2 - 1;      // Example range for Y: -1 to 1 (adjust based on tunnel height)
      
      const newId = `ko_session${gameSessionId}_${nextIdRef.current++}`;
      console.log(`[KnowledgeManager] Spawning new KnowledgeObject: ${newId} at [${randomX.toFixed(2)}, ${randomY.toFixed(2)}, ${SPAWN_Z_KO}]`);


      newKnowledgeObjects.push({
        id: newId,
        position: [randomX, randomY, SPAWN_Z_KO],
        size: KNOWLEDGE_OBJECT_SIZE,
        timeAlive: 0,
      });
    }

    if (
      newKnowledgeObjects.length !== knowledgeObjects.length ||
      newKnowledgeObjects.some((ko, i) => ko.id !== knowledgeObjects[i]?.id || ko.position[2] !== knowledgeObjects[i]?.position[2])
    ) {
      onKnowledgeObjectsChange(newKnowledgeObjects);
    }
  });

  useEffect(() => {
    // Reset ID counter if the component is somehow re-instantiated or for future restart logic
    nextIdRef.current = 0;
    console.log('[KnowledgeManager] Initialized or re-initialized.');
  }, []);


  return null; // This component manages logic, doesn't render anything itself
};

export default KnowledgeManager;