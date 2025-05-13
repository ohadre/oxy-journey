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
import QuestionModal from './ui/QuestionModal';

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

  // --- NEW: Modal Handler Functions ---
  const handleAnswer = useCallback((
    answerDetails: {
      selectedOptionText?: string;
      selectedOptionIndex?: number;
      openAnswerText?: string;
    },
    questionId: string
  ) => {
    console.log('[Scene3D] Answer submitted for question ID:', questionId, 'Details:', answerDetails);

    if (!currentDisplayQuestion) {
      console.error('[Scene3D] handleAnswer called but currentDisplayQuestion is null. This should not happen.');
      setIsModalVisible(false); // Hide modal as a fallback
      setGameState('playing');
      return;
    }

    // Ensure the answer is for the current question
    if (currentDisplayQuestion.id !== questionId) {
      console.warn('[Scene3D] Answer received for a different question ID than current. Ignoring.', 
                   { currentId: currentDisplayQuestion.id, receivedId: questionId });
      // Do not close the modal or change state if it's for a mismatched question
      return;
    }

    let isCorrect = false;
    switch (currentDisplayQuestion.type) {
      case 'multiple-choice':
      case 'yes-no':
        if (typeof answerDetails.selectedOptionIndex === 'number') {
          isCorrect = answerDetails.selectedOptionIndex === currentDisplayQuestion.correctOptionIndex;
          console.log(`[Scene3D] Multiple-choice/Yes-No Answer: User selected index ${answerDetails.selectedOptionIndex}, Correct index: ${currentDisplayQuestion.correctOptionIndex}. Correct: ${isCorrect}`);
        } else {
          console.warn('[Scene3D] No selectedOptionIndex provided for multiple-choice/yes-no question.');
        }
        break;
      case 'open-question':
        // For PoC, any non-empty answer is considered correct
        isCorrect = !!(answerDetails.openAnswerText && answerDetails.openAnswerText.trim());
        console.log(`[Scene3D] Open Question Answer: User input: \"${answerDetails.openAnswerText}\". Considered Correct (PoC): ${isCorrect}`);
        break;
      default:
        console.warn('[Scene3D] Unknown question type in handleAnswer:', currentDisplayQuestion.type);
    }

    if (isCorrect) {
      setAnsweredCorrectlyIds(prev => [...new Set([...prev, currentDisplayQuestion.id])]);
      console.log('[Scene3D] Answer CORRECT. answeredCorrectlyIds updated.');
    } else {
      setLives(prevLives => {
        const newLives = Math.max(0, prevLives - 1);
        console.log(`[Scene3D] Answer INCORRECT. Lives decreased to: ${newLives}`);
        if (newLives <= 0) {
          console.log('[Scene3D] GAME OVER triggered from handleAnswer.');
          setGameState('game_over');
        }
        return newLives;
      });
    }

    setIsModalVisible(false);
    setCurrentDisplayQuestion(null);
    // Only set to playing if not game over
    if (gameState !== 'game_over') {
      setGameState('playing'); 
    }
  }, [currentDisplayQuestion, gameState, lives]); // Added gameState and lives to dependencies

  const handleCloseModal = useCallback(() => {
    console.log('[Scene3D] Modal closed by user (penalty applied).');
    setLives(prevLives => {
      const newLives = Math.max(0, prevLives - 1);
      console.log(`[Scene3D] Lives decreased to: ${newLives} due to modal close.`);
      if (newLives <= 0) {
        console.log('[Scene3D] GAME OVER triggered from handleCloseModal.');
        setGameState('game_over');
      }
      return newLives;
    });

    setIsModalVisible(false);
    setCurrentDisplayQuestion(null);
    // Only set to playing if not game over
    if (gameState !== 'game_over') {
      setGameState('playing');
    }
  }, [gameState, lives]); // Added gameState and lives to dependencies
  // ------------------------------------

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
    console.log(`[Scene3D] Collision detected with ${type}: ${id}. Current gameState: ${gameState}`);

    // Guard: Only trigger Q&A if game is currently 'playing'
    if (gameState !== 'playing') {
      console.log('[Scene3D] Collision occurred but game is not in \'playing\' state. Ignoring Q&A trigger.');
      // Still remove the entity if desired, even if not showing a question
      if (type === 'germ') {
        setGerms(prevGerms => prevGerms.filter(g => g.id !== id));
      } else {
        setDustParticles(prevDust => prevDust.filter(d => d.id !== id));
      }
      return;
    }

    // Remove the collided entity immediately
    if (type === 'germ') {
      console.warn(`[Scene3D] Removing germ ${id} due to collision.`);
      setGerms(prevGerms => prevGerms.filter(g => g.id !== id));
    } else {
      console.warn(`[Scene3D] Removing dust ${id} due to collision.`);
      setDustParticles(prevDust => prevDust.filter(d => d.id !== id));
    }

    // --- Select and Display Question Logic ---
    if (allQuestions.length === 0) {
      console.warn('[Scene3D] Collision occurred, but no questions are loaded. Cannot display question.');
      return; // No questions to ask
    }

    let availableQuestions = allQuestions.filter(q => !answeredCorrectlyIds.includes(q.id));

    if (availableQuestions.length === 0) {
      console.log('[Scene3D] All unique questions answered. Resetting and allowing repeats.');
      setAnsweredCorrectlyIds([]); // Reset for repetition
      availableQuestions = allQuestions; // Consider all questions again
    }

    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const questionToDisplay = availableQuestions[randomIndex];
      
      console.log('[Scene3D] Selected question to display:', questionToDisplay);
      setCurrentDisplayQuestion(questionToDisplay);
      setIsModalVisible(true);
      setGameState('question_paused');
      console.log('[Scene3D] Game state changed to question_paused.');
    } else {
      // This case should ideally not be reached if allQuestions is not empty and reset logic works
      console.warn('[Scene3D] No available questions to display even after trying to reset. Check logic.');
    }
    // --- End Select and Display Question Logic ---

    // Lives decrement will be handled based on question outcome later.

  }, [gameState, allQuestions, answeredCorrectlyIds, lives]); // Added gameState, allQuestions, answeredCorrectlyIds to dependencies

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

  if (!isMounted) {
    console.log('[Scene3D] Not mounted yet, returning null');
    return null;
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <LivesIndicator currentLives={lives} />
      
      {/* REMOVE Temporary Test Button for Q&A Modal */}
      {/* 
      <div style={{ position: 'absolute', top: '60px', left: '10px', zIndex: 1000, color: 'white' }}>
        <button
          onClick={() => {
            startNewQASession(); // Reset Q&A state first
            if (allQuestions.length > 0) {
              const testQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)]; // Pick a random question for variety
              console.log('[Scene3D] Showing test question:', testQuestion);
              setCurrentDisplayQuestion(testQuestion);
              setIsModalVisible(true);
              setGameState('question_paused'); // Pause game when modal is shown
            } else {
              console.warn('[Scene3D] No questions loaded to display in modal.');
            }
          }}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Show Test Question Modal
        </button>
      </div>
      */}
      {/* End Temporary Test Button */}

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

      {/* Render the QuestionModal */}
      {isMounted && (
        <QuestionModal
          question={currentDisplayQuestion}
          isVisible={isModalVisible}
          onAnswer={handleAnswer}
          onClose={handleCloseModal}
          currentLang={currentLanguage}
        />
      )}
    </div>
  );
} 