import React from 'react';
import { useGameState } from './GameStateContext';
import { LivesDisplay } from './LivesDisplay';
import { motion, AnimatePresence } from 'framer-motion';

interface HUDProps {
  className?: string;
}

const HUD: React.FC<HUDProps> = ({ className = '' }) => {
  const { gameState } = useGameState();
  const { score, isGameOver } = gameState;

  return (
    <>
      {/* Fixed positioned Lives Display with improved visibility */}
      <div className="fixed top-4 left-4 z-[20000]">
        <LivesDisplay />
      </div>
      
      {/* Score display at top right */}
      <motion.div 
        className="fixed top-4 right-4 bg-black bg-opacity-70 p-3 rounded-lg text-white text-xl font-bold border border-blue-500 shadow-lg z-[9999]"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Score: {score}
      </motion.div>
      
      {/* Game over modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[10000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 p-8 rounded-lg text-center border-2 border-red-500 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2 className="text-3xl text-red-500 mb-4 font-bold">Game Over</h2>
              <p className="text-white text-xl mb-6">Final Score: {score}</p>
              <motion.button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-bold transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HUD; 