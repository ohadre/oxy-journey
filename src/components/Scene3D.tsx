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
import { fetchAndResolveQuestions } from '../lib/questionService';
import { DisplayQuestion, LanguageCode } from '../types/question.types';
// import QuestionOverlay, { Question } from './QuestionOverlay'; // Assuming this Question is the old type and not needed now
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

export default function Scene3D() {
  const [isMounted, setIsMounted] = useState(false);
  // const worldSize = 10; // worldSize is declared but not used, can be removed if truly unused later
  const { isLoading: isAssetsLoading } = useLoading(); // Renamed for clarity

  const oxyMeshRef = useRef<THREE.Mesh | null>(null);
  const [oxyPosition, setOxyPosition] = useState<[number, number, number]>([0, 0, 140]);
  const [germs, setGerms] = useState<GermInstance[]>([]);
  const [dustParticles, setDustParticles] = useState<DustInstance[]>([]);
  const [lives, setLives] = useState(3);

  // --- MODIFIED/NEW Q&A State Variables ---
  const [allQuestions, setAllQuestions] = useState<DisplayQuestion[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [answeredCorrectlyIds, setAnsweredCorrectlyIds] = useState<string[]>([]);
  // Ensure currentQuestion state uses DisplayQuestion type
  const [currentDisplayQuestion, setCurrentDisplayQuestion] = useState<DisplayQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // This will be used by the actual modal later
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [questionError, setQuestionError] = useState<string | null>(null);
  // --------------------------------------
  const [gameState, setGameState] = useState<GameState>('loading'); // Keep general gameState

  // Add portal container ref (if used by a future modal, keep; otherwise, can be removed if QuestionOverlay is gone)
  // const portalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[Scene3D] Component mounted');
    setIsMounted(true);
    console.log('[Scene3D] Initial Q&A States:', {
      allQuestions: [],
      currentLanguage: 'en',
      answeredCorrectlyIds: [],
      currentDisplayQuestion: null, // Updated name here for clarity in log
      isModalVisible: false,
      isLoadingQuestions: true,
      questionError: null,
    });
    return () => {
      console.log('[Scene3D] Component unmounted');
      setIsMounted(false);
    };
  }, []);
  
  useEffect(() => {
    console.warn(`[Scene3D] --- isAssetsLoading state changed: ${isAssetsLoading} ---`);
  }, [isAssetsLoading]);

  useEffect(() => {
    const loadQuestions = async () => {
      console.log(`[Scene3D] Attempting to load questions for language: ${currentLanguage}`);
      setIsLoadingQuestions(true);
      setQuestionError(null);
      try {
        const fetchedQuestions = await fetchAndResolveQuestions(currentLanguage);
        setAllQuestions(fetchedQuestions);
        console.log('[Scene3D] Questions fetched successfully:', fetchedQuestions);
        if (fetchedQuestions.length === 0) {
          console.warn('[Scene3D] No questions were loaded. Check questions.json or service.');
          setQuestionError('No questions found.');
        }
      } catch (error) {
        console.error('[Scene3D] Error loading questions:', error);
        setQuestionError(error instanceof Error ? error.message : 'Failed to load questions.');
        setAllQuestions([]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    if (isMounted) {
        loadQuestions();
    }
  }, [isMounted, currentLanguage]);
  
  // Set gameState to playing once assets are loaded and component is mounted
  useEffect(() => {
      if (isMounted && !isAssetsLoading) { // Consider asset loading status
          setGameState('playing');
          console.log('[Scene3D] Game state set to playing');
      }
  }, [isMounted, isAssetsLoading]);

  // --- Sub-task 2.3: Q&A Reset Logic ---
  const startNewQASession = useCallback(() => {
    console.log('[Scene3D] Starting new Q&A session (resetting Q&A state).');
    setAnsweredCorrectlyIds([]);
    setCurrentDisplayQuestion(null);
    setIsModalVisible(false);
    // setOpenQuestionAnswer(''); // If we had this state
    // Potentially set gameState to 'playing' if it was 'question_paused' or 'game_over'
    // but primary focus here is resetting Q&A specific state.
    console.log('[Scene3D] Q&A state after reset:', {
      answeredCorrectlyIds: [],
      currentDisplayQuestion: null,
      isModalVisible: false,
    });
  }, []); // No dependencies needed if it only sets state
  // -------------------------------------

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

  // --- REMOVE Temporary Key Listener for K/L keys as it used old testQuestion logic ---
  /*
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' || event.key === 'K') {
        console.log('[Scene3D] K key pressed, setting gameState to question_paused');
        // console.log('[Scene3D] Current gameState:', gameState);
        // console.log('[Scene3D] Current question:', currentDisplayQuestion); // Use new state name
        setGameState('question_paused');
        // setCurrentDisplayQuestion(allQuestions[0] || null); // Example: Set first loaded question
        // console.log('[Scene3D] After update - gameState:', 'question_paused');
        // console.log('[Scene3D] After update - question:', allQuestions[0] || null);
      }
      if (event.key === 'l' || event.key === 'L') {
        console.log('[Scene3D] L key pressed, setting gameState to playing');
        setGameState('playing');
        setCurrentDisplayQuestion(null); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // Adjust dependencies if this effect is re-enabled later
  }, [gameState, currentDisplayQuestion, allQuestions]); 
  */

  // Add effect to monitor state changes
  useEffect(() => {
    console.log('[Scene3D] Q&A State changed - isLoadingQuestions:', isLoadingQuestions, 'Error:', questionError, 'Count:', allQuestions.length);
    // console.log('[Scene3D] Game State changed - gameState:', gameState);
    // console.log('[Scene3D] State changed - currentDisplayQuestion:', currentDisplayQuestion);
  }, [gameState, currentDisplayQuestion, allQuestions, isAssetsLoading, isLoadingQuestions, questionError]);

  const handleAnswerSubmit = useCallback((answer: string | boolean) => {
    console.log('[Scene3D] Answer submitted:', answer);
    // For now, just resume the game
    setGameState('playing');
    setCurrentDisplayQuestion(null);
    setIsModalVisible(false); // Also hide modal
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
            // ref={oxyMeshRef} // ref is not a prop of Oxy. Oxy component needs to use forwardRef if direct ref access is needed by parent.
            worldSize={10} // Pass worldSize if Oxy uses it
            initialPosition={oxyInitialPosition}
            onPositionChange={handleOxyPositionChange}
          />
          <CameraController oxyRef={oxyMeshRef} offset={new THREE.Vector3(0, 0.5, 3.5)} />
        </Canvas>
      </KeyboardControls>

      {/* REMOVE Test overlay based on old K/L key logic */}
      {/* 
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
            <p>Question: {currentDisplayQuestion ? 'Present' : 'None'}</p> // Use new state name
            <button 
              onClick={() => setGameState('playing')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      */}
    </div>
  );
} 