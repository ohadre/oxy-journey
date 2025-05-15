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
import GameOverModal from './ui/GameOverModal'; // Import GameOverModal
import WinModal from './ui/WinModal'; // NEW: Import WinModal
import FinishLine from './FinishLine'; // NEW: Import FinishLine
import InstructionsModal from './ui/InstructionsModal'; // NEW: Import InstructionsModal
import WinProgressIndicator from './ui/WinProgressIndicator'; // NEW: Import WinProgressIndicator
import * as Tone from 'tone'; // Import Tone.js
// NEW: Import KnowledgeInstance (adjust path if you placed it elsewhere)
import { KnowledgeInstance } from '../types/game.types';
// NEW: Import KnowledgeObject
import KnowledgeObject from './KnowledgeObject';
// NEW: Import KnowledgeManager
import KnowledgeManager from './KnowledgeManager';

// --- NEW: Define Tunnel End Z-coordinate ---
const TUNNEL_END_Z = -148; // Assuming tunnel extends into negative Z
// --- NEW: Minimum unique questions for win ---
const MIN_CORRECT_UNIQUE_QUESTIONS = 10; // Example value, can be tuned
// -------------------------------------------

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
type GameState = 'loading' | 'playing' | 'question_paused' | 'game_over' | 'level_complete_debug' | 'won' | 'instructions'; // Added 'instructions'
// -----------------------------------

// --- Define Props for Scene3D ---
interface Scene3DProps {
  currentLanguage: LanguageCode;
  showInstructions?: boolean; // NEW PROP
}
// --------------------------------

export default function Scene3D({ currentLanguage, showInstructions }: Scene3DProps) { // Destructure props
  console.log(`[Scene3D] Component rendering/re-rendering. Lang: ${currentLanguage}, ShowInstructions: ${showInstructions}`); // LOG: Component render

  const [isMounted, setIsMounted] = useState(false);
  // const worldSize = 10; // worldSize is declared but not used, can be removed if truly unused later
  const { isLoading: isAssetsLoading } = useLoading(); // Renamed for clarity

  const oxyMeshRef = useRef<THREE.Mesh | null>(null);
  const [oxyPosition, setOxyPosition] = useState<[number, number, number]>([0, 0, 146]);
  const [germs, setGerms] = useState<GermInstance[]>([]);
  const [dustParticles, setDustParticles] = useState<DustInstance[]>([]);
  // NEW: State for Knowledge Objects, initialized as empty array
  const [knowledgeObjects, setKnowledgeObjects] = useState<KnowledgeInstance[]>([]);
  const [lives, setLives] = useState(3);

  // --- NEW: Game Time Tracking State ---
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(0);
  // -------------------------------------

  // --- MODIFIED/NEW Q&A State Variables ---
  const [allQuestions, setAllQuestions] = useState<DisplayQuestion[]>([]);
  // const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en'); // REMOVE: This will now be a prop
  const [answeredCorrectlyIds, setAnsweredCorrectlyIds] = useState<string[]>([]);
  // Ensure currentQuestion state uses DisplayQuestion type
  const [currentDisplayQuestion, setCurrentDisplayQuestion] = useState<DisplayQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // This will be used by the actual modal later
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [questionError, setQuestionError] = useState<string | null>(null);
  // --------------------------------------
  const [gameState, setGameState] = useState<GameState>('loading'); // Keep general gameState
  const [isOxyInvincible, setIsOxyInvincible] = useState(false);
  const invincibilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [gameSessionId, setGameSessionId] = useState(0); // NEW: For re-keying components on restart
  const [finalScore, setFinalScore] = useState<{time: number, questions: number, lives: number} | null>(null); // NEW: For WinModal score
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] = useState(false); // NEW: For InstructionsModal
  const [hasShownInstructions, setHasShownInstructions] = useState(false); // NEW: To track if instructions have been shown this session

  // Add portal container ref (if used by a future modal, keep; otherwise, can be removed if QuestionOverlay is gone)
  // const portalContainerRef = useRef<HTMLDivElement>(null);

  // --- Sound Effect Setup ---
  const collisionSynth = useMemo(() => {
    if (typeof window !== 'undefined') { // Ensure Tone.js runs only on client
      return new Tone.Synth().toDestination();
    }
    return null;
  }, []);

  // --- NEW: Q&A Sound Effects Setup ---
  const qaModalOpenSynth = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.2 },
      }).toDestination();
    }
    return null;
  }, []);

  const correctAnswerSynth = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
      }).toDestination();
    }
    return null;
  }, []);

  const incorrectAnswerSynth = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.2 },
      }).toDestination();
    }
    return null;
  }, []);
  // ---------------------------------

  // --- NEW: Game Event Sound Effects ---
  const winSoundPlayer = useMemo(() => {
    if (typeof window !== 'undefined') {
      // Ensure Tone.start() has been called by user interaction before this
      // Paths are relative to the public directory
      try {
        const player = new Tone.Player("/music/level-complete-retro-video-game-music-soundroll-variation-2-2-00-04.mp3").toDestination();
        player.load("/music/level-complete-retro-video-game-music-soundroll-variation-2-2-00-04.mp3").then(() => {
          console.log("[Scene3D] Win sound player loaded.");
        }).catch(err => {
          console.error("[Scene3D] Error loading win sound:", err);
        });
        return player;
      } catch (error) {
        console.error("[Scene3D] Error creating win sound player:", error);
        return null;
      }
    }
    return null;
  }, []);

  const gameOverSoundPlayer = useMemo(() => {
    if (typeof window !== 'undefined') {
      // Ensure Tone.start() has been called by user interaction before this
      try {
        const player = new Tone.Player("/music/game-over-retro-video-game-music-soundroll-melody-4-4-00-03.mp3").toDestination();
        player.load("/music/game-over-retro-video-game-music-soundroll-melody-4-4-00-03.mp3").then(() => {
          console.log("[Scene3D] Game over sound player loaded.");
        }).catch(err => {
          console.error("[Scene3D] Error loading game over sound:", err);
        });
        return player;
      } catch (error) {
        console.error("[Scene3D] Error creating game over sound player:", error);
        return null;
      }
    }
    return null;
  }, []);
  // ---------------------------------

  const INITIAL_LIVES = 3;

  // --- Oxy Invincibility Logic (MOVED EARLIER) ---
  const activateOxyInvincibility = useCallback((duration: number) => {
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
    }
    console.log(`[Scene3D] Activating Oxy invincibility for ${duration / 1000} seconds.`);
    setIsOxyInvincible(true);
    invincibilityTimerRef.current = setTimeout(() => {
      setIsOxyInvincible(false);
      invincibilityTimerRef.current = null;
      console.log('[Scene3D] Oxy invincibility ended.');
    }, duration);
  }, []);

  // Cleanup invincibility timer on unmount
  useEffect(() => {
    return () => {
      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
      }
    };
  }, []);
  // ---------------------------------------------

  useEffect(() => {
    console.log('[Scene3D] Component mounted');
    setIsMounted(true);
    console.log('[Scene3D] Initial Q&A States:', {
      allQuestions: [],
      currentLanguage: currentLanguage, // Log the prop value
      answeredCorrectlyIds: [],
      currentDisplayQuestion: null, // Updated name here for clarity in log
      isModalVisible: false,
      isLoadingQuestions: true,
      questionError: null,
    });
    return () => {
      console.log('[Scene3D] Component unmounting, disposing Tone.js objects...');
      if (winSoundPlayer) {
        winSoundPlayer.dispose();
      }
      if (gameOverSoundPlayer) {
        gameOverSoundPlayer.dispose();
      }
      if (collisionSynth) {
        collisionSynth.dispose();
      }
      if (qaModalOpenSynth) {
        qaModalOpenSynth.dispose();
      }
      if (correctAnswerSynth) {
        correctAnswerSynth.dispose();
      }
      if (incorrectAnswerSynth) {
        incorrectAnswerSynth.dispose();
      }
      setIsMounted(false); // Also reset mounted state
    };
  }, [currentLanguage, winSoundPlayer, gameOverSoundPlayer, collisionSynth, qaModalOpenSynth, correctAnswerSynth, incorrectAnswerSynth]); // Added Tone.js objects and currentLanguage to dependency array
  
  useEffect(() => {
    console.warn(`[Scene3D] --- isAssetsLoading state changed: ${isAssetsLoading} ---`);
  }, [isAssetsLoading]);

  useEffect(() => {
    const loadQuestions = async () => {
      console.log(`[Scene3D] Attempting to load questions for language: ${currentLanguage}`); // Uses prop
      setIsLoadingQuestions(true);
      setQuestionError(null);
      try {
        const fetchedQuestions = await fetchAndResolveQuestions(currentLanguage); // Uses prop
        setAllQuestions(fetchedQuestions);
        console.log('[Scene3D] Questions fetched successfully. Count:', fetchedQuestions.length, 'First q text:', fetchedQuestions[0]?.text); // LOG: Questions after fetch
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
  }, [isMounted, currentLanguage]); // Dependency array now correctly uses the prop
  
  // Set gameState to playing once assets are loaded and component is mounted
  useEffect(() => {
      if (isMounted && !isAssetsLoading && gameState === 'loading') {
          // Show instructions only if requested, not yet shown this session, and it's the very first game load (gameSessionId === 0)
          if (showInstructions && !hasShownInstructions && gameSessionId === 0) {
            console.log('[Scene3D] Conditions met to show instructions modal for the first time.');
            setGameState('instructions');
            setIsInstructionsModalVisible(true);
            // It's important NOT to set setHasShownInstructions(true) here,
            // as the user might close the game before interacting with the modal.
            // It should be set when the modal is actively closed by the user.
          } else {
            // If instructions were already shown, or not requested, or not the very first session load with showInstructions=true
            setGameState('playing');
            setGameStartTime(Date.now()); // Start game timer
            setElapsedTimeInSeconds(0); // Reset elapsed time
            console.log('[Scene3D] Game state set to playing, timer started');
          }
      }
  }, [isMounted, isAssetsLoading, gameState, showInstructions, hasShownInstructions, gameSessionId, isInstructionsModalVisible]); // Added hasShownInstructions and isInstructionsModalVisible to dependencies

  // --- Update elapsed time when game is playing ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (gameState === 'playing' && gameStartTime) {
      intervalId = setInterval(() => {
        setElapsedTimeInSeconds(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameState, gameStartTime]);
  // ---------------------------------------------

  // --- NEW: Check for Tunnel End --- (Will be modified to call checkWinConditionsAndProceed)
  useEffect(() => {
    if (gameState === 'playing' && oxyPosition[2] <= TUNNEL_END_Z) {
      console.log(`[Scene3D] Oxy reached defined Tunnel End trigger point at Z: ${oxyPosition[2]}.`);
      checkWinConditionsAndProceed();
    }
  }, [oxyPosition, gameState]); // Removed elapsedTimeInSeconds for now, will be logged in checkWinConditions
  // ---------------------------------

  // --- NEW: Win Condition Check Logic ---
  const checkWinConditionsAndProceed = useCallback(() => {
    console.log('[Scene3D] Checking win conditions...');
    const uniqueQuestionsAnswered = answeredCorrectlyIds.length;
    console.log(`[Scene3D] Current stats: Lives: ${lives}, Unique Questions Answered: ${uniqueQuestionsAnswered}, Required: ${MIN_CORRECT_UNIQUE_QUESTIONS}, Elapsed Time: ${elapsedTimeInSeconds}s`);

    if (lives > 0 && uniqueQuestionsAnswered >= MIN_CORRECT_UNIQUE_QUESTIONS) {
      console.log('%c[Scene3D] WIN CONDITIONS MET! Congratulations!', 'color: green; font-weight: bold;');
      const score = { time: elapsedTimeInSeconds, questions: uniqueQuestionsAnswered, lives }; 
      console.log(`[Scene3D] Scoring Data: Time: ${score.time}s, Questions: ${score.questions}, Lives: ${score.lives}`);
      setFinalScore(score); 
      setGameState('won');
      if (winSoundPlayer && winSoundPlayer.loaded) {
        winSoundPlayer.start(Tone.now());
        console.log('[Scene3D] Win sound played.');
      } else {
        console.warn('[Scene3D] Win sound player not ready or not loaded.');
        if (winSoundPlayer) { // Attempt to load if not loaded
          winSoundPlayer.load("/music/level-complete-retro-video-game-music-soundroll-variation-2-2-00-04.mp3")
            .then(() => winSoundPlayer.start(Tone.now() + 0.1)) // Play with slight delay after loading
            .catch(e => console.error("[Scene3D] Error loading or playing win sound on demand:", e));
        }
      }
    } else {
      console.log('%c[Scene3D] Reached End, WIN CONDITIONS NOT MET.', 'color: orange;');
      if (lives <= 0) {
        console.log('[Scene3D] Reason: No lives left.');
      }
      if (uniqueQuestionsAnswered < MIN_CORRECT_UNIQUE_QUESTIONS) {
        console.log(`[Scene3D] Reason: Not enough unique questions answered (${uniqueQuestionsAnswered}/${MIN_CORRECT_UNIQUE_QUESTIONS}).`);
      }
      setGameState('game_over'); 
      if (gameOverSoundPlayer && gameOverSoundPlayer.loaded) {
        gameOverSoundPlayer.start(Tone.now());
        console.log('[Scene3D] Game over sound played (win conditions not met).');
      } else {
        console.warn('[Scene3D] Game over sound player not ready or not loaded (win conditions not met).');
        if (gameOverSoundPlayer) { // Attempt to load if not loaded
           gameOverSoundPlayer.load("/music/game-over-retro-video-game-music-soundroll-melody-4-4-00-03.mp3")
            .then(() => gameOverSoundPlayer.start(Tone.now() + 0.1)) // Play with slight delay
            .catch(e => console.error("[Scene3D] Error loading or playing game over sound on demand (win conditions not met):", e));
        }
      }
    }
  }, [lives, answeredCorrectlyIds, elapsedTimeInSeconds, winSoundPlayer, gameOverSoundPlayer]);
  // -------------------------------------

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

    if (currentDisplayQuestion.id !== questionId) {
      console.warn('[Scene3D] Answer received for a different question ID than current. Ignoring.', 
                   { currentId: currentDisplayQuestion.id, receivedId: questionId });
      return;
    }

    let isCorrect = false;
    const questionType = currentDisplayQuestion.type; // Store type for later check

    switch (questionType) {
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
        isCorrect = !!(answerDetails.openAnswerText && answerDetails.openAnswerText.trim());
        console.log(`[Scene3D] Open Question Answer: User input: \"${answerDetails.openAnswerText}\". Considered Correct (PoC): ${isCorrect}`);
        break;
      default:
        console.warn('[Scene3D] Unknown question type in handleAnswer:', questionType);
    }

    if (isCorrect) {
      setAnsweredCorrectlyIds(prev => [...new Set([...prev, currentDisplayQuestion.id])]);
      console.log('[Scene3D] Answer CORRECT. answeredCorrectlyIds updated.');
      if (correctAnswerSynth) {
        correctAnswerSynth.triggerAttackRelease("C5", "8n", Tone.now() + 0.01);
        console.log('[Scene3D] Correct answer sound played.');
      }
      if (lives > 0) {
        activateOxyInvincibility(3000);
      }
      // If it's an open question, modal will handle its own state for showing explanation.
      // So, we don't hide it or change game state here.
      if (questionType !== 'open-question') {
        setIsModalVisible(false);
        setCurrentDisplayQuestion(null);
        if (gameState !== 'game_over') {
          setGameState('playing');
        }
      }
    } else {
      // Incorrect answer
      if (incorrectAnswerSynth) {
        incorrectAnswerSynth.triggerAttackRelease("C3", "4n", Tone.now() + 0.01);
        console.log('[Scene3D] Incorrect answer sound played.');
      }
      setLives(prevLives => {
        const newLives = Math.max(0, prevLives - 1);
        console.log(`[Scene3D] Answer INCORRECT. Lives decreased to: ${newLives}`);
        if (newLives <= 0) {
          setGameState('game_over');
          console.log('[Scene3D] GAME OVER triggered from handleAnswer.');
          if (gameOverSoundPlayer && gameOverSoundPlayer.loaded) {
            gameOverSoundPlayer.start(Tone.now());
            console.log('[Scene3D] Game over sound played (handleAnswer).');
          } else {
            console.warn('[Scene3D] Game over sound player not ready or not loaded (handleAnswer).');
             if (gameOverSoundPlayer) {
                gameOverSoundPlayer.load("/music/game-over-retro-video-game-music-soundroll-melody-4-4-00-03.mp3")
                .then(() => gameOverSoundPlayer.start(Tone.now() + 0.1))
                .catch(e => console.error("[Scene3D] Error loading or playing game over sound on demand (handleAnswer):", e));
            }
          }
        } else {
          activateOxyInvincibility(3000);
        }
        return newLives;
      });
      // For incorrect answers (any type), close modal and return to play
      setIsModalVisible(false);
      setCurrentDisplayQuestion(null);
      if (gameState !== 'game_over') {
        setGameState('playing');
      }
    }
    // Removed general modal closing from here; handled conditionally above.
  }, [currentDisplayQuestion, gameState, lives, activateOxyInvincibility, correctAnswerSynth, incorrectAnswerSynth, gameOverSoundPlayer]);

  const handleCloseModal = useCallback((isContinuation?: boolean) => {
    if (isContinuation) {
      console.log('[Scene3D] Modal closed after explanation (continuation). No penalty.');
      // No penalty, just close and resume
    } else {
      console.log('[Scene3D] Modal closed by user (penalty applied).');
      if (incorrectAnswerSynth) {
        incorrectAnswerSynth.triggerAttackRelease("G2", "4n", Tone.now() + 0.01);
        console.log('[Scene3D] Modal close (penalty) sound played.');
      }
      setLives(prevLives => {
        const newLives = Math.max(0, prevLives - 1);
        console.log(`[Scene3D] Lives decreased to: ${newLives} due to modal close.`);
        if (newLives <= 0) {
          setGameState('game_over');
          console.log('[Scene3D] GAME OVER triggered from handleCloseModal.');
          if (gameOverSoundPlayer && gameOverSoundPlayer.loaded) {
            gameOverSoundPlayer.start(Tone.now());
            console.log('[Scene3D] Game over sound played (handleCloseModal).');
          } else {
            console.warn('[Scene3D] Game over sound player not ready or not loaded (handleCloseModal).');
            if (gameOverSoundPlayer) {
              gameOverSoundPlayer.load("/music/game-over-retro-video-game-music-soundroll-melody-4-4-00-03.mp3")
              .then(() => gameOverSoundPlayer.start(Tone.now() + 0.1))
              .catch(e => console.error("[Scene3D] Error loading or playing game over sound on demand (handleCloseModal):", e));
            }
          }
        } else {
          activateOxyInvincibility(3000);
        }
        return newLives;
      });
    }

    setIsModalVisible(false);
    setCurrentDisplayQuestion(null);
    if (gameState !== 'game_over') {
      setGameState('playing');
    }
  }, [gameState, lives, activateOxyInvincibility, incorrectAnswerSynth, gameOverSoundPlayer]);
  // ------------------------------------

  // --- Game Restart Logic --- (MODIFIED)
  const handleRestartGame = useCallback(() => {
    console.log('[Scene3D] Restarting game...');

    // Clear invincibility
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
      invincibilityTimerRef.current = null;
    }
    setIsOxyInvincible(false);
    setFinalScore(null); // NEW: Reset final score
    setIsInstructionsModalVisible(false); // Ensure instructions modal is hidden on restart
    setHasShownInstructions(false); // Reset for potential re-trigger if gameSessionId logic were different, safe to reset.

    setLives(INITIAL_LIVES);
    setAnsweredCorrectlyIds([]);
    setCurrentDisplayQuestion(null); 
    setIsModalVisible(false);      
    setOxyPosition([0, 0, 146]); 
    setGerms([]);
    setDustParticles([]);

    // Reset timers
    setElapsedTimeInSeconds(0);
    // gameStartTime will be reset when gameState transitions from 'loading' to 'playing'

    // Increment gameSessionId to force re-mount of key components
    setGameSessionId(prevId => prevId + 1);
    
    // Set gameState to 'loading' to allow re-initialization sequence
    setGameState('loading'); 
    console.log('[Scene3D] Game restart initiated. State set to loading. New session ID:', gameSessionId + 1);
  }, [gameSessionId]); // Added gameSessionId to dependency array
  // -------------------------

  // --- NEW: Instructions Modal Handler ---
  const handleCloseInstructionsModal = useCallback(() => {
    console.log('[Scene3D] Instructions modal closed by user.');
    setIsInstructionsModalVisible(false);
    setHasShownInstructions(true); // Mark instructions as shown so they don't reappear this session.
    // Transition to loading, which will then transition to playing via the useEffect
    setGameState('loading'); 
    // gameStartTime will be set when gameState transitions from 'loading' to 'playing'
  }, []); // Dependencies for useCallback should be empty if it only calls setters for state defined in the component.
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

  // NEW: Callback for KnowledgeManager to update knowledge objects
  const handleKnowledgeObjectsChange = useCallback((updatedKnowledgeObjects: KnowledgeInstance[]) => {
    setKnowledgeObjects(updatedKnowledgeObjects);
  }, []);

  const handleCollision = useCallback((type: 'germ' | 'dust', id: string) => {
    console.log(`[Scene3D] Collision detected with ${type}: ${id}. Current gameState: ${gameState}, Invincible: ${isOxyInvincible}`);

    if (isOxyInvincible) {
      console.log('[Scene3D] Collision occurred while Oxy is invincible. Ignoring penalty and question.');
      // Still remove the entity to prevent immediate re-collision when invincibility ends
      if (type === 'germ') {
        setGerms(prevGerms => prevGerms.filter(g => g.id !== id));
      } else {
        setDustParticles(prevDust => prevDust.filter(d => d.id !== id));
      }
      return;
    }

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

    // --- Play Collision Sound ---
    if (collisionSynth && Tone.context.state !== 'running') {
      Tone.start(); // Ensure AudioContext is running
      console.log('[Scene3D] AudioContext started by collision sound.');
    }
    if (collisionSynth) {
      // Explicitly stop any ongoing note and schedule the new one with a slight delay
      collisionSynth.triggerRelease(Tone.now()); 
      collisionSynth.triggerAttackRelease("C4", "8n", Tone.now() + 0.01); 
      console.log('[Scene3D] Collision sound played.');
    }
    // ---------------------------

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
      console.log('[Scene3D] All unique questions have been answered correctly. Allowing questions to repeat.');
      // setAnsweredCorrectlyIds([]); // DO NOT RESET: We want to keep track of all unique correct answers for the win condition.
      availableQuestions = allQuestions; // Consider all questions again
    }

    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const questionToDisplay = availableQuestions[randomIndex];
      
      console.log('[Scene3D] Selected question to display:', questionToDisplay);
      setCurrentDisplayQuestion(questionToDisplay);
      setIsModalVisible(true);
      if (qaModalOpenSynth && Tone.context.state !== 'running') {
        Tone.start(); // Ensure AudioContext is running
        console.log('[Scene3D] AudioContext started by Q&A modal open sound.');
      }
      if (qaModalOpenSynth) { // Play modal open sound
        qaModalOpenSynth.triggerAttackRelease("G4", "8n", Tone.now() + 0.01);
        console.log('[Scene3D] Q&A modal open sound played.');
      }
      setGameState('question_paused');
      console.log('[Scene3D] Game state changed to question_paused.');
    } else {
      // This case should ideally not be reached if allQuestions is not empty and reset logic works
      console.warn('[Scene3D] No available questions to display even after trying to reset. Check logic.');
    }
    // --- End Select and Display Question Logic ---

    // Lives decrement will be handled based on question outcome later.

  }, [gameState, allQuestions, answeredCorrectlyIds, lives, isOxyInvincible, activateOxyInvincibility, collisionSynth, qaModalOpenSynth]);

  // Add effect to monitor state changes
  useEffect(() => {
    console.log('[Scene3D] Q&A State changed - isLoadingQuestions:', isLoadingQuestions, 'Error:', questionError, 'Count:', allQuestions.length);
    // console.log('[Scene3D] Game State changed - gameState:', gameState);
    // console.log('[Scene3D] State changed - currentDisplayQuestion:', currentDisplayQuestion);
  }, [gameState, currentDisplayQuestion, allQuestions, isAssetsLoading, isLoadingQuestions, questionError]);

  // LOG: States before render return
  const isWonStateForLog = gameState === 'won'; // Capture for logging

  console.log(`[Scene3D] PRE-RETURN STATE (isWon: ${isWonStateForLog}):`, { // MODIFIED for clarity
    isMounted,
    currentLanguageProp: currentLanguage,
    allQuestionsCount: allQuestions.length,
    isLoadingQuestions,
    gameState,
    questionError,
    isAssetsLoading,
    finalScore,
    isInstructionsModalVisible // NEW: Log instructions modal visibility
  });

  // --- LivesIndicator Rendering (Modified for debug) ---
  const renderLivesIndicator = () => {
    if (gameState === 'level_complete_debug') { // This state will be removed eventually
      return <LivesIndicator currentLives={0} maxLives={0} />; 
    } else if (gameState === 'won') {
      return <LivesIndicator currentLives={lives} maxLives={INITIAL_LIVES} />; // Show lives at point of winning
      // Or a custom message like <LivesIndicator message="YOU WON!" /> if we adapt LivesIndicator
    }
    return <LivesIndicator currentLives={lives} />;
  };
  // ---------------------------------------------------

  if (!isMounted) {
    console.log('[Scene3D] Not mounted yet, returning null');
    return null;
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {renderLivesIndicator()}
      {/* NEW: Render WinProgressIndicator if game is in a state where it makes sense (e.g., playing) */}
      {isMounted && (gameState === 'playing' || gameState === 'question_paused') && (
        <WinProgressIndicator 
          currentCorrect={answeredCorrectlyIds.length} 
          targetCorrect={MIN_CORRECT_UNIQUE_QUESTIONS}
          currentLang={currentLanguage} 
        />
      )}
      
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
        <Canvas camera={{ position: [0, 0, 80], fov: 60, near: 0.1, far: 2000 }}> 
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 10, 40]} intensity={2.0} color="#ffd9a0" />
          <directionalLight position={[0, -10, -40]} intensity={1.2} color="#a0c8ff" />
          
          <Suspense fallback={null}>
            <Tunnel key={`tunnel-${gameSessionId}`} />
            <FinishLine key={`finishline-${gameSessionId}`} position={[0, 0, TUNNEL_END_Z]} />
          </Suspense>
          <GermManager
            key={`germ-manager-${gameSessionId}`}
            oxyPosition={oxyPosition}
            onGermsChange={handleGermsChange}
            germs={germs}
            gameState={gameState}
          />
          <DustManager
            key={`dust-manager-${gameSessionId}`}
            onDustChange={handleDustChange}
            dustParticles={dustParticles}
            gameState={gameState}
          />
          {/* NEW: Add KnowledgeManager */}
          <KnowledgeManager
            key={`knowledge-manager-${gameSessionId}`}
            knowledgeObjects={knowledgeObjects}
            onKnowledgeObjectsChange={handleKnowledgeObjectsChange}
            gameState={gameState}
            gameSessionId={gameSessionId}
          />
          <CollisionManager
            key={`collision-manager-${gameSessionId}`}
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

          {/* NEW: Render Knowledge Objects */}
          {(Array.isArray(knowledgeObjects) ? knowledgeObjects : []).map(ko => (
            <KnowledgeObject key={ko.id} position={ko.position} size={ko.size} />
          ))}

          <Oxy 
            key={`oxy-${gameSessionId}`}
            ref={oxyMeshRef}
            worldSize={10} // Pass worldSize if Oxy uses it
            initialPosition={oxyInitialPosition}
            onPositionChange={handleOxyPositionChange}
            gameState={gameState} 
            isInvincible={isOxyInvincible} // Pass invincibility state
          />
          <CameraController 
            key={`camera-controller-${gameSessionId}`}
            oxyRef={oxyMeshRef} 
            offset={new THREE.Vector3(0, 0.5, 3.5)} // Reverted Z offset to 3.5
            gameState={gameState} // Pass gameState
          />
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

      {/* Render the GameOverModal */}
      {isMounted && (
        <GameOverModal 
          isVisible={gameState === 'game_over'}
          onRestart={handleRestartGame}
          currentLang={currentLanguage}
        />
      )}

      {/* NEW: Render the WinModal */}
      {isMounted && (
        <WinModal
          isVisible={gameState === 'won'}
          onRestart={handleRestartGame}
          scoreData={finalScore}
          currentLang={currentLanguage}
        />
      )}

      {/* NEW: Render the InstructionsModal */}
      {isMounted && (
        <InstructionsModal
          isVisible={isInstructionsModalVisible}
          onClose={handleCloseInstructionsModal}
          currentLang={currentLanguage}
        />
      )}
    </div>
  );
} 