import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../GameStateContext';
import { cn } from '@/lib/utils';

interface V0ComponentProps {
  className?: string;
}

const V0Component: React.FC<V0ComponentProps> = ({ className }) => {
  const { gameState } = useGameState();

  return (
    <motion.div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-black/50 z-[20000]",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-8 rounded-lg text-center border-2 border-blue-500 shadow-2xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <h2 className="text-3xl text-blue-500 mb-4 font-bold">Game Stats</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white">Score:</span>
            <span className="text-blue-400 font-bold">{gameState.score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Lives:</span>
            <span className="text-blue-400 font-bold">{gameState.lives}</span>
          </div>
        </div>
        <motion.button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-bold transition-colors duration-200 w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
        >
          Restart Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default V0Component; 