import React, { useState, useRef, useEffect, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import WinModal from '../ui/WinModal';
import GameOverModal from '../ui/GameOverModal'; // Assuming you will create this
import SoundManager, { SoundManagerHandle } from '../audio/SoundManager';
import QuestionModal from '../ui/QuestionModal'; // Added import for QuestionModal

// Intentionally throw an error to see if this module code is running
throw new Error("ERROR_MARKER: Scene3D.tsx module level code is EXECUTING. If you see this, the file is current.");

// console.log('[Scene3D MODULE LEVEL] Checking imported SoundManager immediately:', SoundManager); // MODULE LEVEL LOG
// try {
//   console.log('[Scene3D MODULE LEVEL] SoundManager.magicProperty:', (SoundManager as any)?.magicProperty);
// } catch (e) {
//   console.error('[Scene3D MODULE LEVEL] Error accessing SoundManager.magicProperty:', e);
// }

export type LanguageCode = "en" | "he";

// Define a type for the score data
interface ScoreData {
  time: number;
  questions: number;
  lives: number;
}

export interface Scene3DProps {
  initialGameData?: { lang?: LanguageCode }; // Use LanguageCode here too
  onBackToHome?: () => void;
  onSessionUpdate?: (data: any) => void; // Consider defining a more specific type
  initialPlayerPosition?: [number, number, number];
  onRestart?: () => void;
  // gameState, currentLanguage, etc., if they are props, should be listed here.
  // If they are internal state, their useState definitions might be missing from the component body.
}

// Define more specific types if possible, instead of 'any'
// For example, if you have a type for what a question object looks like:
// import { DisplayQuestion } from '../../types/question.types'; // Example path

const Scene3D: React.FC<Scene3DProps> = ({ initialGameData, onBackToHome, onSessionUpdate, initialPlayerPosition, onRestart }) => {
  // console.log('[Scene3D COMPONENT BODY START] Checking SoundManager at component start. Typeof:', typeof SoundManager, 'Value:', SoundManager);
  // try {
  //   console.log('[Scene3D COMPONENT BODY START] SoundManager.magicProperty:', (SoundManager as any)?.magicProperty);
  // } catch (e) {
  //   console.error('[Scene3D COMPONENT BODY START] Error accessing SoundManager.magicProperty:', e);
  // }
  const [isSoundManagerLoaded, setIsSoundManagerLoaded] = useState(false);
  const soundManagerRef = useRef<SoundManagerHandle>(null);

  // --------- START: Added useState definitions for missing variables ---------
  const [gameState, setGameState] = useState<string>('loading'); // Or 'idle', 'playing', etc.
  const [currentDisplayQuestion, setCurrentDisplayQuestion] = useState<any | null>(null); // Replace 'any' with your Question type
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // Use LanguageCode for currentLanguage state
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(initialGameData?.lang || 'en'); 
  // Use the specific ScoreData type for finalScore
  const [finalScore, setFinalScore] = useState<ScoreData | null>(null); 

  // Placeholder functions for handlers - their actual logic was likely lost
  const handleAnswer = (answerData: any) => {
    console.log('[Scene3D] handleAnswer called with:', answerData);
    // Actual logic to process answer, update score, lives, etc.
    setIsModalVisible(false); // Example: hide modal after answer
  };

  const handleCloseModal = () => {
    console.log('[Scene3D] handleCloseModal called');
    setIsModalVisible(false);
  };

  const handleRestartGame = () => {
    console.log('[Scene3D] handleRestartGame called');
    // Actual logic to reset game state (lives, score, positions, gameState, etc.)
    setFinalScore(null); // Reset final score
    setGameState('playing'); // Example: set to playing
    if (onRestart) {
      onRestart(); // Call prop if provided
    }
  };
  // --------- END: Added useState definitions for missing variables ---------

  // Effect for managing background music based on gameState
  useEffect(() => {
    console.log('[Scene3D] Background music effect triggered. gameState:', gameState, 'isSoundManagerLoaded:', isSoundManagerLoaded, 'soundManagerRef.current:', soundManagerRef.current);
    if (!isSoundManagerLoaded || !soundManagerRef.current) {
      if (!isSoundManagerLoaded) console.log('[Scene3D] SoundManager not loaded yet.');
      if (!soundManagerRef.current) console.log('[Scene3D] soundManagerRef is null (in effect).'); // Added detail
      return;
    }

    if (gameState === 'playing') {
      console.log('[Scene3D] Attempting to play background music via SoundManager.');
      soundManagerRef.current.playBackgroundMusic();
    } else if (gameState === 'question_paused' || gameState === 'game_over' || gameState === 'won' || gameState === 'paused') {
      console.log('[Scene3D] Attempting to pause background music via SoundManager.');
      soundManagerRef.current.pauseBackgroundMusic();
    }
  }, [gameState, isSoundManagerLoaded]);

  return (
    <>
      <Canvas>
        {/* 
          IMPORTANT: Your actual 3D scene components (Oxy, Tunnel, Germs, lights, camera, etc.) 
          should be children of this Canvas. 
          The snippet provided doesn't show them, but they must be here.
          Example:
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Oxy /> 
          <Tunnel />
          ... other 3D elements ...
        */}
        {/* // ... existing 3D code ... (placeholder for your actual scene) */}
      </Canvas>
      
      {/* Modals and SoundManager are now outside the Canvas */}
      <QuestionModal
        question={currentDisplayQuestion}
        isVisible={isModalVisible}
        onAnswer={handleAnswer}
        onClose={handleCloseModal}
        currentLang={currentLanguage}
      />

      <WinModal 
        isVisible={!!finalScore && gameState === 'won'}
        scoreData={finalScore}
        onRestart={handleRestartGame}
        currentLang={currentLanguage}
      />

      {gameState === 'game_over' && (
        <GameOverModal 
          onRestart={handleRestartGame} 
          currentLang={currentLanguage}
          isVisible={gameState === 'game_over'}
        />
      )}

      <SoundManager onLoaded={() => { // Temporarily comment out SoundManager invocation
        console.log("[Scene3D] SoundManager onLoaded callback fired!");
        setIsSoundManagerLoaded(true);
      }} />
    </>
  );
};

export default Scene3D; 