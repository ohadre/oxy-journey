import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayQuestion } from '../../types/question.types'; // Adjust path as needed
import Image from 'next/image'; // Import next/image

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
  onClose: (isContinuation?: boolean) => void; // Modified to accept optional flag
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
  const [openInputText, setOpenInputText] = useState('');
  const [isShowingExplanation, setIsShowingExplanation] = useState(false); // New state

  const titleText = currentLang === 'he' ? '!חידון חמצנון' : 'Oxy Challenge!';

  useEffect(() => {
    if (!isVisible) {
      setOpenInputText('');
      setIsShowingExplanation(false);
    } else if (question) {
      // Reset if question changes OR if it's not an open question currently showing explanation
      if (!isShowingExplanation || question.id !== (currentQuestionForEffectRef.current?.id) || question.type !== 'open-question') {
        setOpenInputText('');
        setIsShowingExplanation(false);
      }
    }
    currentQuestionForEffectRef.current = question; // Keep track of current question for next effect run
  }, [question, isVisible, isShowingExplanation]);

  // Ref to help useEffect track the question for which an explanation might be showing
  const currentQuestionForEffectRef = useRef<DisplayQuestion | null>(null);

  const handleOpenAnswerSubmit = () => {
    if (question) {
      onAnswer({ openAnswerText: openInputText }, question.id);
      // Don't clear openInputText here, allow explanation to show first
      setIsShowingExplanation(true); 
    }
  };

  const handleContinueAfterExplanation = () => {
    onClose(true); // Pass true to indicate this is a continuation
  };

  const renderQuestionContent = () => {
    if (!question) {
      return <p>Error: Question data is missing.</p>;
    }
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div>
            <p 
              className={`text-xl md:text-2xl font-semibold text-indigo-800 mb-6 ${currentLang === 'he' ? 'text-right' : 'text-center'}`}
              dir={currentLang === 'he' ? 'rtl' : 'ltr'}
            >
              {question.text}
            </p>
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
            <p 
              className={`text-xl md:text-2xl font-semibold text-indigo-800 mb-8 ${currentLang === 'he' ? 'text-right' : 'text-center'}`}
              dir={currentLang === 'he' ? 'rtl' : 'ltr'}
            >
              {question.text}
            </p>
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
        if (isShowingExplanation && question.explanation) {
          return (
            <div>
              <p 
                className={`text-xl md:text-2xl font-semibold text-indigo-800 mb-4 ${currentLang === 'he' ? 'text-right' : 'text-center'}`}
                dir={currentLang === 'he' ? 'rtl' : 'ltr'}
              >
                {question.text}
              </p>
              {openInputText && ( // Optionally show the user's answer
                <div className="mb-4 p-3 bg-indigo-100 border border-indigo-300 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Your answer:</p>
                  <p className="text-indigo-800">{openInputText}</p>
                </div>
              )}
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Explanation:</h4>
                <p className="text-green-700 whitespace-pre-line">{question.explanation}</p>
              </div>
              <button 
                onClick={handleContinueAfterExplanation}
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                Continue
              </button>
            </div>
          );
        }
        return (
          <div>
            <p 
              className={`text-xl md:text-2xl font-semibold text-indigo-800 mb-6 ${currentLang === 'he' ? 'text-right' : 'text-center'}`}
              dir={currentLang === 'he' ? 'rtl' : 'ltr'}
            >
              {question.text}
            </p>
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

  if (!isVisible || !question) {
    return null;
  }

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

            {/* Optional Image Display */}
            {question.image_url && (
              <div className="mb-4 w-full max-h-60 overflow-hidden rounded-lg flex justify-center items-center">
                <Image 
                  src={question.image_url} 
                  alt={question.topic || 'Question image'} // Use topic as alt text, or generic fallback
                  width={300} // Provide a base width, will be constrained by max-h-60 and object-fit
                  height={240} // Provide a base height
                  className="object-contain w-auto h-auto max-w-full max-h-full"
                  priority // Consider if images are critical enough for priority loading
                />
              </div>
            )}

            <div 
              className="flex justify-center items-center mb-6 pt-4 md:pt-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-purple-700 text-center">
                {question ? question.topic : 'Loading Topic...'}
              </h3>
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