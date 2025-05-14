import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  oxyRef: React.RefObject<THREE.Mesh | null>;
  offset?: THREE.Vector3;
  smoothness?: number;
  gameState?: 'loading' | 'playing' | 'question_paused' | 'game_over' | 'level_complete_debug' | 'won';
}

const CameraController: React.FC<CameraControllerProps> = ({ 
  oxyRef, 
  offset = new THREE.Vector3(0, 0.5, 3.5),
  smoothness = 0.1,
  gameState
}) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const isInitialized = useRef(false);

  // Initialize camera position
  useEffect(() => {
    if (oxyRef.current && !isInitialized.current) {
      const oxyPosition = oxyRef.current.position.clone();
      const initialPosition = oxyPosition.clone().add(offset);
      camera.position.copy(initialPosition);
      currentPosition.current.copy(initialPosition);
      targetPosition.current.copy(initialPosition);
      isInitialized.current = true;
    }
  }, [camera, offset, oxyRef]);

  useFrame((_, delta) => {
    if (gameState && gameState !== 'playing') return;
    if (!oxyRef.current || !isInitialized.current) return;

    const oxyPosition = oxyRef.current.position;
    
    // Calculate target position
    targetPosition.current.copy(oxyPosition).add(offset);

    // Smoothly interpolate current position to target
    currentPosition.current.lerp(targetPosition.current, smoothness);

    // Update camera position
    camera.position.copy(currentPosition.current);

    // Make camera look at Oxy
    camera.lookAt(oxyPosition);
  });

  return null;
};

export default CameraController; 