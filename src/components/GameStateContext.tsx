import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the game state interface
interface GameState {
  lives: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

// Define the context interface with state and actions
interface GameStateContextType {
  gameState: GameState;
  loseLife: () => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

// Create the context with a default undefined value
const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Custom hook for using the game state context
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

// Initial game state
const initialGameState: GameState = {
  lives: 3,
  score: 0,
  isGameOver: false,
  isPaused: false,
};

// Provider component
interface GameStateProviderProps {
  children: ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Actions to modify game state
  const loseLife = () => {
    setGameState(prevState => {
      const newLives = prevState.lives - 1;
      return {
        ...prevState,
        lives: newLives,
        isGameOver: newLives <= 0,
      };
    });
  };

  const addScore = (points: number) => {
    setGameState(prevState => ({
      ...prevState,
      score: prevState.score + points,
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const pauseGame = () => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: true,
    }));
  };

  const resumeGame = () => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: false,
    }));
  };

  // Log game state changes for debugging
  useEffect(() => {
    console.log('[GameState] Updated:', gameState);
  }, [gameState]);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        loseLife,
        addScore,
        resetGame,
        pauseGame,
        resumeGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}; 