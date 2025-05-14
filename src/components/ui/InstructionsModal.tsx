'use client';

import React from 'react';
import { Button } from './button';
import { X, AlertTriangle, CheckCircle, Heart, Target, Gamepad2 } from 'lucide-react'; // Added more icons
import Image from 'next/image';

interface InstructionsModalProps {
  isVisible: boolean;
  onClose: () => void; // This will typically set gameState to 'loading' or 'playing'
  currentLang: string;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isVisible, onClose, currentLang }) => {
  if (!isVisible) {
    return null;
  }

  const messages = {
    en: {
      title: "Oxy's Grand Journey Awaits!",
      welcome: "Hey there, Oxygen hero! Get ready for an epic quest!",
      objectiveHeader: "Your Vital Mission",
      objectiveText: "Brave the winding paths of the respiratory system! Dodge dangers, answer wisely when you meet a Germ or Dust, and guide Oxy safely to the very end!",
      controlsHeader: "Master Your Moves",
      controlsText: [
        "Up/Down/Left/Right: Use ↑ ↓ ← → Arrow Keys",
        "Zoom Forward: Press E to dive deeper!",
        "Ease Backward: Tap Q (but not too much!)",
      ],
      questionsHeader: "Microscopic Encounters!",
      germText: "Watch out for Germs!",
      dustText: "Dust Bunnies Ahead!",
      questionDetailsText: "Colliding pauses your journey for a quick quiz! Answer RIGHT for a shield of invincibility. A WRONG answer, or closing the question, costs a precious life!",
      livesHeader: "Guard Your Lives",
      livesText: "You start with 3! Lose them all, and the adventure's over. Stay sharp!",
      winConditionHeader: "The Finish Line!",
      winConditionText: "Reach the tunnel's end with at least one life and by correctly answering enough unique questions. Victory awaits!",
      startButton: "Let's Begin the Adventure!",
    },
    he: {
      title: "המסע הגדול של חמצנון מחכה!",
      welcome: "שלום לך, גיבור חמצן! היכון למסע מופלא!",
      objectiveHeader: "המשימה החיונית שלך",
      objectiveText: "התמודד באומץ עם שבילי מערכת הנשימה המתפתלים! התחמק מסכנות, ענה בחוכמה כשתפגוש חיידק או אבק, והוביל את חמצנון בבטחה עד הסוף!",
      controlsHeader: "שלוט בתנועותיך",
      controlsText: [
        "למעלה/למטה/שמאלה/ימינה: השתמש במקשי החצים ↑ ↓ ← →",
        "זינוק קדימה: לחץ E כדי לצלול עמוק יותר!",
        "נסיגה זהירה: הקש Q (אך לא יותר מדי!)",
      ],
      questionsHeader: "מפגשים מיקרוסקופיים!",
      germText: "היזהר מחיידקים!",
      dustText: "אבקנים לפניך!",
      questionDetailsText: "התנגשות תשהה את מסעך לשאלון מהיר! תשובה נכונה תעניק לך מגן חסינות. תשובה שגויה, או סגירת השאלה, תעלה בחיי חמצן יקרים!",
      livesHeader: "שמור על חייך",
      livesText: "מתחילים עם 3! אם תאבד את כולם, ההרפתקה נגמרת. הישאר חד!",
      winConditionHeader: "קו הסיום!",
      winConditionText: "הגע לסוף המנהרה עם לפחות חיים אחד ועל ידי מתן תשובות נכונות למספר מספיק של שאלות ייחודיות. הניצחון מחכה!",
      startButton: "בוא נתחיל את ההרפתקה!",
    },
  };

  const langMessages = messages[currentLang as keyof typeof messages] || messages.en;
  const textDirection = currentLang === 'he' ? 'rtl' : 'ltr';

  // Helper for section rendering
  const renderSection = (icon: React.ReactNode, title: string, content: string | string[]) => (
    <div className="bg-white/10 p-3 sm:p-4 rounded-lg shadow-md mb-3">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className={`font-semibold text-lg sm:text-xl ml-2 ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>{title}</h3>
      </div>
      {Array.isArray(content) ? (
        <ul className={`list-none ${currentLang === 'he' ? 'pr-1' : 'pl-1'} space-y-1 text-sm sm:text-base`}>
          {content.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm sm:text-base">{content}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-2 sm:p-4">
      <div 
        dir={textDirection}
        style={{backdropFilter: 'blur(5px)'}}
        className="bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500 p-5 sm:p-6 rounded-2xl shadow-2xl text-white max-w-3xl w-full flex flex-col transform transition-all scale-100 opacity-100 max-h-[95vh]" // Removed overflow-y-auto, added flex flex-col
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4 flex-shrink-0"> {/* Title area, non-scrollable */}
          <h2 className={`text-2xl sm:text-4xl font-bold ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>{langMessages.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close instructions" className="hover:bg-white/20">
            <X className="h-7 w-7 text-white" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-grow pr-2 space-y-3"> {/* Scrollable content area */}
          <p className="mb-3 sm:mb-4 text-md sm:text-lg italic">{langMessages.welcome}</p>

          {renderSection(<Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-300" />, langMessages.objectiveHeader, langMessages.objectiveText)}
          
          {renderSection(<Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />, langMessages.controlsHeader, langMessages.controlsText)}

          <div className="bg-white/10 p-3 sm:p-4 rounded-lg shadow-md mb-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-300" />
              <h3 className={`font-semibold text-lg sm:text-xl ml-2 ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>{langMessages.questionsHeader}</h3>
            </div>
            <div className="flex items-start sm:items-center mb-2 text-sm sm:text-base">
              <Image src="/textures/germ.png" alt="Germ" width={36} height={36} className="mr-2 mt-1 sm:mt-0" /> {/* Slightly larger image */}
              <p><span className="font-semibold">{langMessages.germText}</span></p>
            </div>
            <div className="flex items-start sm:items-center mb-2 text-sm sm:text-base">
              <Image src="/textures/dust.png" alt="Dust" width={36} height={36} className="mr-2 mt-1 sm:mt-0" /> {/* Slightly larger image */}
              <p><span className="font-semibold">{langMessages.dustText}</span></p>
            </div>
            <p className="text-sm sm:text-base mt-1">{langMessages.questionDetailsText}</p>
          </div>
          
          {renderSection(<Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />, langMessages.livesHeader, langMessages.livesText)}
          
          {renderSection(<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-teal-300" />, langMessages.winConditionHeader, langMessages.winConditionText)}
        </div>

        <div className="mt-auto pt-4 flex-shrink-0"> {/* Button area, non-scrollable, mt-auto pushes to bottom */}
          <Button 
            onClick={onClose} 
            className={`w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 sm:py-4 px-6 rounded-lg text-lg sm:text-xl transition-all duration-150 ease-in-out hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`} 
          >
            {langMessages.startButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal; 