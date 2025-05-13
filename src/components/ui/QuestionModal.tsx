import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayQuestion } from '../../types/question.types'; // Adjust path as needed

interface QuestionModalProps {
  question: DisplayQuestion | null;
  isVisible: boolean;
  currentLang?: 'en' | 'he'; // Add currentLang prop
  onAnswer: (
    answerDetails: {
      selectedOptionText?: string; 
      selectedOptionIndex?: number; 
      openAnswerText?: string;    
    },
    questionId: string
  ) => void;
  onClose: () => void;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2, ease: "easeIn" }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut", type: "spring", stiffness: 300, damping: 25 }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const QuestionModal: React.FC<QuestionModalProps> = ({ 
  question, 
  isVisible, 
  currentLang, 
  onAnswer, 
  onClose 
}) => {
  // State for open question text input
  const [openInputText, setOpenInputText] = useState('');

  const titleText = currentLang === 'he' ? '!חידון חמצנון' : 'Oxy Challenge!';

  // Reset input text when question changes or modal becomes hidden
  useEffect(() => {
    if (!isVisible || (question && question.type !== 'open-question')) {
      setOpenInputText('');
    } else if (isVisible && question && question.type === 'open-question') {
      // Optionally pre-fill or clear. For now, ensure it's clear if it becomes visible again.
      setOpenInputText('');
    }
  }, [question, isVisible]);

  const handleOpenAnswerSubmit = () => {
    if (question) { // question should not be null here due to the check above
      onAnswer({ openAnswerText: openInputText }, question.id);
      setOpenInputText(''); // Clear input after submission
    }
  };

  const renderQuestionContent = () => {
    if (!question) {
      return <p>Error: Question data is missing.</p>;
    }
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div>
            <p className="text-xl md:text-2xl font-semibold text-indigo-800 mb-6 text-center">{question.text}</p>
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer({ selectedOptionText: option.text, selectedOptionIndex: index }, question.id)}
                className="block w-full text-center p-3 mb-3 bg-orange-400 hover:bg-orange-500 text-indigo-900 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-75"
              >
                {option.text}
              </button>
            ))}
          </div>
        );
      case 'yes-no': 
        return (
          <div>
            <p className="text-xl md:text-2xl font-semibold text-indigo-800 mb-8 text-center">{question.text}</p>
            <div className="flex justify-center space-x-4 md:space-x-6">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswer({ selectedOptionText: option.text, selectedOptionIndex: index }, question.id)}
                  className="flex-1 max-w-xs text-center px-6 py-3 bg-orange-400 hover:bg-orange-500 text-indigo-900 font-bold text-lg rounded-xl shadow-md transition-all duration-150 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-75 active:bg-orange-600"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        );
      case 'open-question':
        return (
          <div>
            <p className="text-xl md:text-2xl font-semibold text-indigo-800 mb-6 text-center">{question.text}</p>
            <textarea 
              className="w-full p-3 mb-4 text-indigo-900 bg-white border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
              rows={3}
              placeholder="Type your answer here..."
              value={openInputText}
              onChange={(e) => setOpenInputText(e.target.value)}
            />
            <button 
              onClick={handleOpenAnswerSubmit}
              className="w-full p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-100 focus:ring-green-600 disabled:opacity-60"
              disabled={!openInputText.trim()}
            >
              Submit Answer
            </button>
          </div>
        );
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          initial="hidden" // Apply initial state for the backdrop as well if needed or remove for instant backdrop
          animate="visible"
          exit="exit"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="relative bg-amber-50 text-indigo-900 p-6 md:p-8 rounded-xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 max-w-lg"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Floating Title Section */}
            <div className="absolute -top-14 md:-top-16 left-1/2 transform -translate-x-1/2 w-auto px-4 py-2 flex justify-center items-center space-x-3 z-10">
              {/* Oxy Image */}
              <img 
                src="/textures/oxy.png" 
                alt="Oxy" 
                className="h-12 w-12 md:h-14 md:w-14 object-contain"
              />
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500 whitespace-nowrap">
                {titleText}
              </h2>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 md:pt-6">
              <h3 className="text-2xl md:text-3xl font-bold text-purple-700">
                {question ? question.topic : 'Loading Topic...'}
              </h3>
              <button 
                onClick={onClose}
                className="text-purple-400 hover:text-purple-600 text-4xl leading-none p-1 -mr-2 -mt-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            
            {question ? renderQuestionContent() : (
              <div className="text-center py-8">
                <p className="text-indigo-700">Loading question...</p>
                {/* Optional: Add a spinner here */}
              </div>
            )}

            {/* Placeholder for explanation - this logic will be more complex later */}
            {/* {question.explanation && question.answered && (
              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <h4 className="font-semibold mb-1">Explanation:</h4>
                <p className="text-sm text-gray-300">{question.explanation}</p>
              </div>
            )} */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestionModal; 