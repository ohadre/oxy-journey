'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Assuming this path is correct based on your components.json
import { motion } from 'framer-motion';

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'he'>('he');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLang(event.target.value as 'en' | 'he');
  };

  const pageTitle = currentLang === 'he' ? 'אוקסי ג\'רני - דף הבית' : 'Oxy Journey - Home';
  const startGameText = currentLang === 'he' ? 'התחל' : 'START'; // Adjusted for v0 button style
  const langSelectLabel = currentLang === 'he' ? 'שפה:' : 'Language:';
  const mainTitleText = currentLang === 'he' ? 'המסע של חמצנון' : "Oxy's Journey"; // New dynamic title

  const handleStartGame = () => {
    console.log("[HomePage] Start Game button clicked. Language:", currentLang);
    setIsLoading(true);
    // Navigate to the game page with the selected language and showInstructions flag
    router.push(`/game?lang=${currentLang}&showInstructions=true`);
  };

  const toggleLanguage = () => {
    // ... existing code ...
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <h1 className="text-3xl font-bold font-game"> {/* Added font-game for consistency */}
          {currentLang === 'he' ? 'טוען משחק...' : 'Loading Game...'}
        </h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/textures/main page bg.png" // Updated path
            alt="Game Background" 
            fill 
            priority 
            className="object-cover" 
          />
        </div>

        {/* Language Selector Dropdown - Top Right (from original page) */}
        <div className="absolute top-4 right-4 z-20"> {/* Increased z-index */}
          <label htmlFor="language-select" className="sr-only">{langSelectLabel}</label>
          <select
            id="language-select"
            value={currentLang}
            onChange={handleLanguageChange}
            // Basic styling to be visible, can be improved to match new theme
            className="bg-white bg-opacity-60 text-black font-semibold py-2 px-3 rounded-lg shadow-md focus:outline-none focus:ring-2 ring-blue-500 transition-colors"
          >
            <option value="en">English</option>
            <option value="he">עברית</option>
          </select>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          {/* Title and Oxy */}
          <div className="relative mb-16 flex items-center">
            <h1 className="text-center font-game text-6xl font-bold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:text-7xl lg:text-8xl">
              {mainTitleText}
            </h1>
            <motion.div
              className="absolute -right-32 top-0 h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/textures/oxy.png" // Updated path
                alt="Oxy the Bubble"
                width={200}
                height={200}
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>

          {/* Start Button and Enemies */}
          <div className="relative">
            <Button
              onClick={handleStartGame}
              className="bg-emerald-500 px-12 py-6 text-2xl font-bold text-white hover:bg-emerald-600 font-game" // Added font-game
            >
              {startGameText}
            </Button>

            <motion.div
              className="absolute -left-40 -top-10 h-24 w-24 md:h-32 md:w-32"
              animate={{
                y: [0, 10, 0],
                x: [0, -5, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/textures/dust.png" // Updated path
                alt="Dust"
                width={150}
                height={150}
                className="h-full w-full object-contain"
              />
            </motion.div>

            <motion.div
              className="absolute -left-24 top-10 h-28 w-28 md:h-36 md:w-36"
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Image
                src="/textures/germ.png" // Updated path
                alt="Germ"
                width={150}
                height={150}
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}