'use client';

import React from 'react';
import { Button } from './button'; // Assuming a Shadcn UI button
import Image from 'next/image'; // For the congratulatory image

interface WinModalProps {
  isVisible: boolean;
  onRestart: () => void;
  scoreData: {
    time: number;
    questions: number;
    lives: number;
  } | null;
  currentLang: string;
}

const WinModal: React.FC<WinModalProps> = ({ isVisible, onRestart, scoreData, currentLang }) => {
  if (!isVisible || !scoreData) {
    return null;
  }

  const messages = {
    en: {
      title: "Congratulations, You Won!",
      time: "Time Taken:",
      questions: "Correct Questions:",
      lives: "Lives Remaining:",
      seconds: "s",
      playAgain: "Play Again",
      imageAlt: "Victory image"
    },
    he: {
      title: "כל הכבוד, ניצחת!",
      time: "זמן משחק:",
      questions: "שאלות נכונות:",
      lives: "חיים שנותרו:",
      seconds: "שניות",
      playAgain: "שחק שוב",
      imageAlt: "תמונת ניצחון"
    },
  };

  const langMessages = messages[currentLang as keyof typeof messages] || messages.en;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-400 to-blue-500 p-6 sm:p-8 rounded-xl shadow-2xl text-white text-center max-w-md w-full transform transition-all scale-100 opacity-100">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">{langMessages.title}</h2>
        
        {/* User-Provided Image */}
        <div className="my-4 sm:my-6">
          <Image 
            src="/textures/win.png" // Path to the image in the public directory
            alt={langMessages.imageAlt}
            width={200} // Example width, adjust as needed
            height={150} // Example height, adjust as needed
            className="mx-auto rounded-lg shadow-lg" 
          /> 
        </div>

        <div className="space-y-2 sm:space-y-3 text-lg sm:text-xl mb-6 sm:mb-8">
          <p>{langMessages.time} <span className="font-semibold">{scoreData.time}{langMessages.seconds}</span></p>
          <p>{langMessages.questions} <span className="font-semibold">{scoreData.questions}</span></p>
          <p>{langMessages.lives} <span className="font-semibold">{scoreData.lives}</span></p>
        </div>

        <Button 
          onClick={onRestart} 
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-lg sm:text-xl transition-transform duration-150 ease-in-out hover:scale-105 w-full"
        >
          {langMessages.playAgain}
        </Button>
      </div>
    </div>
  );
};

export default WinModal; 