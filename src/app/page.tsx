'use client';

import React, { useState } from 'react';
// Link will be used by the StartGameModal later, so keep the import for now
// import Link from 'next/link'; 
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter

// Removed StartGameModal import as it's no longer used
// import StartGameModal from '../components/ui/StartGameModal'; 

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'he'>('en');
  const router = useRouter(); // Initialize useRouter

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLang(event.target.value as 'en' | 'he');
  };

  const pageTitle = currentLang === 'he' ? 'אוקסי ג\'רני - דף הבית' : 'Oxy Journey - Home';
  const startGameText = currentLang === 'he' ? 'התחל משחק' : 'Start Game';
  const langSelectLabel = currentLang === 'he' ? 'שפה:' : 'Language:';

  const handleStartGame = () => {
    router.push(`/game?lang=${currentLang}`);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center p-4" // Added relative for positioning context
        style={{
          backgroundImage: "url('/textures/main page bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Language Selector Dropdown - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <label htmlFor="language-select" className="sr-only">{langSelectLabel}</label>
          <select
            id="language-select"
            value={currentLang}
            onChange={handleLanguageChange}
            className="bg-white bg-opacity-80 text-gray-800 font-semibold py-2 px-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          >
            <option value="en">English</option>
            <option value="he">עברית</option>
          </select>
        </div>

        <div className="bg-black bg-opacity-30 p-6 md:p-8 rounded-2xl shadow-xl text-center flex flex-col items-center space-y-8"> {/* Increased space-y for modal button potentially */}
          
          {/* Title (Optional, could be part of BG image or added later) */}
          {/* 
          <h1 className={`text-5xl font-bold text-white mb-8 [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]">
            {currentLang === 'he' ? 'מסעו של אוקסי' : 'Oxy Journey'}
          </h1> 
          */}

          {/* Start Game Button - Now navigates directly and styled like GameOverModal button */}
          <button 
            onClick={handleStartGame} // Updated onClick handler
            // Adapted styles from GameOverModal's restart button:
            className="mt-4 px-10 py-4 bg-amber-400 hover:bg-amber-500 text-neutral-800 font-bold text-2xl rounded-xl shadow-lg transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-75 active:bg-amber-600"
          >
            {startGameText}
          </button>
        </div>

        {/* Removed StartGameModal rendering */}
      </div>
    </>
  );
}