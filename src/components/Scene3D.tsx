'use client';

import React, { useRef, useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { /* OrbitControls, */ KeyboardControls } from '@react-three/drei';
import { Oxy } from './Oxy';
// import { WorldBoundaries } from './WorldBoundaries';
import dynamic from 'next/dynamic';
import CameraController from './CameraController';
import * as THREE from 'three';
import Germ from './Germ';
import DustParticle from './DustParticle';
import GermManager, { GermInstance } from './GermManager';
import DustManager, { DustInstance } from './DustManager';
import { useLoading } from './LoadingManager';
import LivesIndicator from './LivesIndicator';
import { CollisionManager } from './CollisionManager';
import QuestionOverlay, { Question } from './QuestionOverlay';
import { createPortal } from 'react-dom';

// Dynamically import the Tunnel component to ensure it only renders on the client side
const Tunnel = dynamic(() => import('./Tunnel'), { 
  ssr: false,
  loading: () => null
});

// Helper Component to log camera info
// const CameraLogger = () => { ... };

const keyboardMap = [
  { name: 'forward', keys: ['KeyE'] },
  { name: 'backward', keys: ['KeyQ'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'up', keys: ['ArrowUp', 'KeyW'] },
  { name: 'down', keys: ['ArrowDown', 'KeyS'] },
];

// --- Define Game State Type (NEW) ---
type GameState = 'loading' | 'playing' | 'question_paused' | 'game_over';
// -----------------------------------

// Add test question
const testQuestion: Question = {
  id: 1,
  text: "What is the main function of the respiratory system?",
  type: "multiple_choice",
  options: [
    "To pump blood throughout the body",
    "To exchange oxygen and carbon dioxide",
    "To digest food",
    "To filter waste from the blood"
  ],
  correctAnswer: "To exchange oxygen and carbon dioxide"
};

export default function Scene3D() {
  const [isMounted, setIsMounted] = useState(false);
  const worldSize = 10;
  const { isLoading } = useLoading();

  const oxyMeshRef = useRef<THREE.Mesh | null>(null);
  const [oxyPosition, setOxyPosition] = useState<[number, number, number]>([0, 0, 140]);
  const [germs, setGerms] = useState<GermInstance[]>([]);
  const [dustParticles, setDustParticles] = useState<DustInstance[]>([]);
  const [lives, setLives] = useState(3);

  // --- New State Variables (NEW) ---
  const [gameState, setGameState] = useState<GameState>('loading');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  // -------------------------------

  // Add portal container ref
  const portalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[Scene3D] Component mounted');
    setIsMounted(true);
    return () => {
      console.log('[Scene3D] Component unmounted');
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    console.warn(`[Scene3D] --- isLoading state changed: ${isLoading} ---`);
  }, [isLoading]);

  // --- Set gameState to playing once mounted (NEW) ---
  useEffect(() => {
      if (isMounted) {
          setGameState('playing');
      }
  }, [isMounted]);
  // -------------------------------------------------

  const oxyInitialPosition = useMemo(() => new THREE.Vector3(oxyPosition[0], oxyPosition[1], oxyPosition[2]), [oxyPosition]);

  const handleOxyPositionChange = useCallback((pos: [number, number, number]) => {
    setOxyPosition(pos);
  }, []);

  const handleGermsChange = useCallback((updatedGerms: GermInstance[]) => {
    setGerms(updatedGerms);
  }, []);

  const handleDustChange = useCallback((updatedDust: DustInstance[]) => {
    setDustParticles(updatedDust);
  }, []);

  const handleCollision = useCallback((type: 'germ' | 'dust', id: string) => {
    console.log(`[Scene3D] Collision detected with ${type}: ${id}`);

    // --- Temporarily Comment Out Immediate Collision Effects (for Sub-Task 1) (MODIFIED) ---
    // if (lives > 0) {
    //   setLives(prevLives => Math.max(0, prevLives - 1));
    //   if (type === 'germ') {
    //     console.warn(`[Scene3D] !!! Collision with germ ${id} - Lives would be reduced !!!`);
    //     // setGerms(prevGerms => prevGerms.filter(g => g.id !== id)); // Example: Actual removal might be handled by manager
    //   } else {
    //     console.warn(`[Scene3D] !!! Collision with dust ${id} - Lives would be reduced !!!`);
    //     // setDustParticles(prevDust => prevDust.filter(d => d.id !== id)); // Example: Actual removal might be handled by manager
    //   }
    // }
    // -----------------------------------------------------------------------------------

    // For Sub-Task 2, we will set gameState to 'question_paused' here.
    // For now, this function just logs the collision.

  }, [lives]); // Keeping 'lives' dependency for now, though not directly used in this stub.

  // --- Temporary Key Listener for Testing Sub-Task 1 : K to pause, L to play (MODIFIED) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' || event.key === 'K') {
        console.log('[Scene3D] K key pressed, setting gameState to question_paused');
        console.log('[Scene3D] Current gameState:', gameState);
        console.log('[Scene3D] Current question:', currentQuestion);
        setGameState('question_paused');
        setCurrentQuestion(testQuestion); // Set the test question when pausing
        console.log('[Scene3D] After update - gameState:', 'question_paused');
        console.log('[Scene3D] After update - question:', testQuestion);
      }
      if (event.key === 'l' || event.key === 'L') {
        console.log('[Scene3D] L key pressed, setting gameState to playing');
        setGameState('playing');
        setCurrentQuestion(null); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, currentQuestion]); // Add dependencies to track changes

  // Add effect to monitor state changes
  useEffect(() => {
    console.log('[Scene3D] State changed - gameState:', gameState);
    console.log('[Scene3D] State changed - currentQuestion:', currentQuestion);
  }, [gameState, currentQuestion]);

  const handleAnswerSubmit = useCallback((answer: string | boolean) => {
    console.log('[Scene3D] Answer submitted:', answer);
    // For now, just resume the game
    setGameState('playing');
    setCurrentQuestion(null);
  }, []);

  if (!isMounted) {
    console.log('[Scene3D] Not mounted yet, returning null');
    return null;
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <LivesIndicator currentLives={lives} />
      
      <KeyboardControls map={keyboardMap}>
        <Canvas camera={{ position: [0, 0, 80], fov: 70 }}> 
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 10, 40]} intensity={2.0} color="#ffd9a0" />
          <directionalLight position={[0, -10, -40]} intensity={1.2} color="#a0c8ff" />
          
          <Suspense fallback={null}>
            <Tunnel />
          </Suspense>
          <GermManager
            oxyPosition={oxyPosition}
            onGermsChange={handleGermsChange}
            germs={germs}
          />
          <DustManager
            onDustChange={handleDustChange}
            dustParticles={dustParticles}
          />
          <CollisionManager
            oxyPosition={oxyPosition}
            germs={germs}
            dustParticles={dustParticles}
            onCollision={handleCollision}
          />
          {(Array.isArray(germs) ? germs : []).map(germ => (
            <Germ key={germ.id} position={germ.position} size={germ.size} />
          ))}
          {(Array.isArray(dustParticles) ? dustParticles : []).map(dust => (
            <DustParticle key={dust.id} position={dust.position} size={dust.size} />
          ))}
          <Oxy 
            ref={oxyMeshRef} 
            worldSize={worldSize}
            initialPosition={oxyInitialPosition}
            onPositionChange={handleOxyPositionChange}
          />
          <CameraController oxyRef={oxyMeshRef} offset={new THREE.Vector3(0, 0.5, 3.5)} />
        </Canvas>
      </KeyboardControls>

      {/* Test overlay */}
      {gameState === 'question_paused' && (
        <div 
          className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center" 
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'auto'
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Test Overlay</h2>
            <p>Game State: {gameState}</p>
            <p>Question: {currentQuestion ? 'Present' : 'None'}</p>
            <button 
              onClick={() => setGameState('playing')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 