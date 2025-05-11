import React, { createContext, useContext, useState, useCallback } from 'react';

interface GameStateContextType {
  lives: number;
  isInvulnerable: boolean;
  handleCollision: () => void;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

interface GameStateProviderProps {
  children: React.ReactNode;
  initialLives?: number;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ 
  children, 
  initialLives = 3 
}) => {
  const [lives, setLives] = useState(initialLives);
  const [isInvulnerable, setIsInvulnerable] = useState(false);

  const handleCollision = useCallback(() => {
    if (isInvulnerable) return;

    setLives(prev => Math.max(0, prev - 1));
    setIsInvulnerable(true);

    // Reset invulnerability after 2 seconds
    setTimeout(() => {
      setIsInvulnerable(false);
    }, 2000);
  }, [isInvulnerable]);

  const resetGame = useCallback(() => {
    setLives(initialLives);
    setIsInvulnerable(false);
  }, [initialLives]);

  return (
    <GameStateContext.Provider value={{
      lives,
      isInvulnerable,
      handleCollision,
      resetGame
    }}>
      {children}
    </GameStateContext.Provider>
  );
}; 