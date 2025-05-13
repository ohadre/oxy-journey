import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameOverModalProps {
  isVisible: boolean;
  currentLang?: 'en' | 'he';
  onRestart: () => void;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.2, ease: "easeIn" }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut", type: "spring", stiffness: 280, damping: 22 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  isVisible,
  currentLang,
  onRestart,
}) => {
  const gameOverText = currentLang === 'he' ? '!המשחק הסתיים' : 'Game Over';
  const restartText = currentLang === 'he' ? 'שחק שוב' : 'Restart Game';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
          style={{ zIndex: 20000 }} // Higher z-index than QuestionModal
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="bg-red-700 text-white p-8 md:p-10 rounded-xl shadow-xl w-full max-w-md text-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 [text-shadow:0_0_8px_rgba(0,0,0,0.5)]">
              {gameOverText}
            </h2>
            
            {/* Optional: Add score or other details here later */}
            {/* <p className="text-lg mb-8">You did your best!</p> */}

            <button
              onClick={onRestart}
              className="mt-4 px-8 py-3 bg-amber-400 hover:bg-amber-500 text-red-800 font-bold text-xl rounded-lg shadow-md transition-all duration-150 ease-in-out hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-75 active:bg-amber-600"
            >
              {restartText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal; 