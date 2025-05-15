'use client';

import React from 'react';

interface WinProgressIndicatorProps {
  currentCorrect: number;
  targetCorrect: number;
  currentLang: string; // For potential localization of "Progress"
}

const WinProgressIndicator: React.FC<WinProgressIndicatorProps> = ({
  currentCorrect,
  targetCorrect,
  currentLang,
}) => {
  const messages = {
    en: {
      progressLabel: "Win Progress:",
      goalReachedTitle: "Objective Met!",
      goalReachedSubtitle: "Head to the finish line!",
      outOf: "/", // Using slash for English
    },
    he: {
      progressLabel: "התקדמות לניצחון:",
      goalReachedTitle: "המטרה הושלמה!",
      goalReachedSubtitle: "המשיכו אל קו הסיום!",
      outOf: "מתוך", // Hebrew for "out of"
    },
  };

  const langMessages = messages[currentLang as keyof typeof messages] || messages.en;
  const textDirection = currentLang === 'he' ? 'rtl' : 'ltr';

  if (targetCorrect <= 0) {
    return null;
  }

  const isGoalReached = currentCorrect >= targetCorrect;
  const progressPercentage = Math.min((currentCorrect / targetCorrect) * 100, 100);

  return (
    <div
      dir={textDirection}
      className={`absolute top-4 left-4 bg-black bg-opacity-75 p-3 sm:p-4 rounded-lg shadow-2xl text-white ${
        currentLang === 'he' ? 'font-game-he' : 'font-game'
      } text-base sm:text-lg z-50 w-64 sm:w-72`}
    >
      {isGoalReached ? (
        <div className="text-center">
          <div className={`font-bold text-lg sm:text-xl ${currentLang === 'he' ? 'font-game-he' : 'font-game'} text-yellow-400`}>
            {langMessages.goalReachedTitle}
          </div>
          <div className={`text-sm sm:text-base mt-1 ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>
            {langMessages.goalReachedSubtitle}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mt-2 overflow-hidden">
            <div
              className="bg-green-500 h-3 sm:h-4 rounded-full"
              style={{ width: `100%` }}
            ></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm sm:text-base ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>{langMessages.progressLabel}</span>
            <span className={`text-sm sm:text-base font-mono ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>
              {currentLang === 'he' ? 
                `${currentCorrect} ${langMessages.outOf} ${targetCorrect}` : 
                `${currentCorrect} ${langMessages.outOf} ${targetCorrect}` // English will use '/' from langMessages.outOf
              }
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3 sm:h-4 dark:bg-gray-700 overflow-hidden">
            <div
              className="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default WinProgressIndicator; 