console.error("KNOWLEDGE_ITEM_MANAGER_IS_DEFINITELY_PARSING_THIS_LINE_OF_CODE");

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

console.log('[KIManager] MODULE LEVEL: KnowledgeItemManager.tsx file is loaded and parsed.'); // Log 1: Module loaded

// Constants for KnowledgeItemManager
const MAX_KNOWLEDGE_ITEMS = 5; // Max items present at once
const SPAWN_INTERVAL = 5.0; // seconds, adjust as needed
const INITIAL_SPAWN_DELAY = 2.0; // seconds
const TUNNEL_RADIUS = 6; // Should match Scene3D/Oxy/GermManager
const SPAWN_Z_MIN = -140; // Min Z for spawning
const SPAWN_Z_MAX = 140;  // Max Z for spawning, ensuring items aren't at the very ends
const SPAWN_AREA_OFFSET = 20; // Keep items away from absolute Z min/max

// Helper function to generate random positions within the tunnel
const getRandomPositionInTunnelManager = (): THREE.Vector3 => {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * (TUNNEL_RADIUS - 1.5); // Keep away from tunnel wall
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  // Ensure Z is within a range that's not too close to player start or far end initially
  const z = SPAWN_Z_MIN + SPAWN_AREA_OFFSET + Math.random() * (SPAWN_Z_MAX - SPAWN_Z_MIN - 2 * SPAWN_AREA_OFFSET);
  return new THREE.Vector3(x, y, z);
};

// Available question IDs - this could also come from a prop or a shared service
const AVAILABLE_QUESTION_IDS = ["q_gen_001", "q_gen_002", "q_gen_003", "q_gen_004", "q_gen_005", "q_tech_001", "q_tech_002", "q_hist_001"];


export interface KnowledgeItemInstance {
  id: string;
  position: [number, number, number]; // Keep as array for easier prop passing to <KnowledgeItem />
  size: number;
  questionId: string;
  // 'collected' flag might not be needed here if items are removed from list by Scene3D on collection
}

interface KnowledgeItemManagerProps {
  knowledgeItems: KnowledgeItemInstance[];
  onKnowledgeItemsChange: (updatedItems: KnowledgeItemInstance[]) => void;
  gameState: 'loading' | 'playing' | 'question_paused' | 'game_over' | 'won' | 'instructions';
}

const KnowledgeItemManager: React.FC<KnowledgeItemManagerProps> = ({
  knowledgeItems,
  onKnowledgeItemsChange,
  gameState,
}) => {
  console.log('[KIManager] COMPONENT BODY: KnowledgeItemManager function component is executing.'); // Log 2: Component function called

  const [isReadyToSpawn, setIsReadyToSpawn] = useState(false);
  const nextIdRef = useRef(Date.now());
  const spawnTimerRef = useRef(0);

  useEffect(() => {
    // Delay initial spawning to allow game to load/start
    console.log('[KIManager] useEffect: Setting up initial spawn delay.');
    const timer = setTimeout(() => {
      console.log('[KIManager] useEffect: Initial spawn delay completed. Setting isReadyToSpawn = true.');
      setIsReadyToSpawn(true);
    }, INITIAL_SPAWN_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  useFrame((_, delta) => {
    if (gameState !== 'playing' || !isReadyToSpawn) {
      if (spawnTimerRef.current !== 0) {
        // Log only if we are resetting a possibly active timer
        console.log(`[KIManager] useFrame: Not spawning. gameState: ${gameState}, isReadyToSpawn: ${isReadyToSpawn}. Resetting spawn timer.`);
        spawnTimerRef.current = 0; 
      }
      return;
    }

    let newItemsList = Array.isArray(knowledgeItems) ? [...knowledgeItems] : [];
    spawnTimerRef.current += delta;

    // console.log(`[KIManager] useFrame: Checking spawn. Items: ${newItemsList.length}/${MAX_KNOWLEDGE_ITEMS}, Timer: ${spawnTimerRef.current.toFixed(2)}/${SPAWN_INTERVAL}`);

    if (newItemsList.length < MAX_KNOWLEDGE_ITEMS && spawnTimerRef.current >= SPAWN_INTERVAL) {
      console.log(`[KIManager] useFrame: Spawning new item. Current count: ${newItemsList.length}, Timer: ${spawnTimerRef.current.toFixed(2)}`);
      const newPositionVec = getRandomPositionInTunnelManager();
      const assignedQuestionId = AVAILABLE_QUESTION_IDS[Math.floor(Math.random() * AVAILABLE_QUESTION_IDS.length)];
      
      const newItem: KnowledgeItemInstance = {
        id: `k-item-${nextIdRef.current++}`,
        position: newPositionVec.toArray() as [number, number, number],
        size: 0.8, 
        questionId: assignedQuestionId,
      };
      newItemsList.push(newItem);
      spawnTimerRef.current = 0; 
    }

    // Always call onKnowledgeItemsChange with the current list if the manager is active.
    // This mirrors GermManager behavior and ensures Scene3D gets updates.
    // The previous conditional update might have prevented Scene3D from re-rendering.
    // console.log('[KIManager] useFrame: Calling onKnowledgeItemsChange with count:', newItemsList.length);
    onKnowledgeItemsChange(newItemsList);

  });

  return null; // This component does not render anything itself
};

export default KnowledgeItemManager; 