'use client';

import React from 'react';
import { Button } from './button';
import { X, AlertTriangle, CheckCircle, Heart, Target, Gamepad2 } from 'lucide-react'; // Added more icons
import Image from 'next/image';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameWinConditionKnowledge: number;
  currentLang: string;
  initialLives: number;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  gameWinConditionKnowledge,
  currentLang,
  initialLives,
}) => {
  if (!isOpen) return null;

  const messages = {
    en: {
      title: "Oxy's Grand Journey Awaits!",
      welcome: "Hey there, Oxygen Hero! Ready for an epic quest through the amazing respiratory system?",
      objectiveHeader: "Your Vital Mission!",
      objectiveText: `Guide Oxy safely! Collect shimmering Knowledge Objects, answer their questions wisely to make progress, and skillfully dodge hazardous Germs and pesky Dust particles to survive!`,
      controlsHeader: "Master Your Moves",
      controlsText: [
        "Navigate: Use your ↑ ↓ ← → Arrow Keys.",
        "Zoom Forward: Press E to dive deeper!",
        "Ease Backward: Tap Q for a gentle retreat.",
      ],
      knowledgeAndHazardsHeader: "Knowledge, Hazards & Survival!",
      knowledgeObjectText: "Grab glowing Knowledge Objects! Each one holds a question. Answer correctly for a temporary shield of invincibility and to get closer to victory! Wrong answers from these don't cost lives, but you won't progress.",
      hazardsText: "Watch Out! Direct hits from Germs or Dust will cost a precious life! Stay alert!",
      collectKOsPrompt: "Collect these for questions & power-ups!",
      avoidGermsPrompt: "Dodge these pesky Germs!",
      avoidDustPrompt: "Steer clear of Dust clouds!",
      livesHeader: "Guard Your Lives!",
      livesText: `You have ${initialLives} lives. Lose them all, and the adventure resets. Be careful out there!`,
      winConditionHeader: "Path to Victory!",
      winConditionText: `Correctly answer ${gameWinConditionKnowledge} question${gameWinConditionKnowledge === 1 ? '' : 's'} from Knowledge Objects to complete Oxy's journey and win! Good luck, hero!`,
      startButton: "Let's Begin the Adventure!",
    },
    he: {
      title: "המסע הגדול של חמצנון מחכה!",
      welcome: "שלום לך, גיבור חמצן! מוכן למסע מופלא במערכת הנשימה המדהימה?",
      objectiveHeader: "משימתך החיונית!",
      objectiveText: `הוביל את חמצנון בבטחה! אסוף חפצי ידע זוהרים, ענה על שאלותיהם בחוכמה כדי להתקדם, והתחמק במיומנות מחיידקים מזיקים ומחלקיקי אבק טורדניים כדי לשרוד!`,
      controlsHeader: "שלוט בתנועותיך",
      controlsText: [
        "ניווט: השתמש במקשי החצים ↑ ↓ ← →.",
        "זינוק קדימה: לחץ E כדי לצלול עמוק יותר!",
        "נסיגה זהירה: הקש Q לנסיגה קלה.",
      ],
      knowledgeAndHazardsHeader: "ידע, סכנות והישרדות!",
      knowledgeObjectText: "תפוס חפצי ידע זוהרים! כל אחד מהם טומן בחובו שאלה. ענה נכון כדי לזכות במגן חסינות זמני ולהתקרב לניצחון! תשובות שגויות מאובייקטים אלו לא עולות חיים, אך לא תתקדם.",
      hazardsText: "היזהר! פגיעה ישירה מחיידקים או אבק תעלה בחיי חמצן יקרים! הישאר ערני!",
      collectKOsPrompt: "אסוף אותם לשאלות וחיזוקים!",
      avoidGermsPrompt: "התחמק מהחיידקים המציקים!",
      avoidDustPrompt: "התרחק מענני האבק!",
      livesHeader: "שמור על חייך!",
      livesText: `ברשותך ${initialLives} חיים. אם תאבד את כולם, ההרפתקה מתאפסת. היזהר שם בחוץ!`,
      winConditionHeader: "הדרך לניצחון!",
      winConditionText: `ענה נכון על ${gameWinConditionKnowledge} שאלה${gameWinConditionKnowledge === 1 ? '' : 'ות'} מחפצי ידע כדי להשלים את מסעו של חמצנון ולנצח! בהצלחה, גיבור!`,
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
              <h3 className={`font-semibold text-lg sm:text-xl ml-2 ${currentLang === 'he' ? 'font-game-he' : 'font-game'}`}>{langMessages.knowledgeAndHazardsHeader}</h3>
            </div>
            <p className="text-sm sm:text-base mb-2 leading-relaxed">{langMessages.knowledgeObjectText}</p>
            <div className="flex items-start sm:items-center mb-1 text-sm sm:text-base">
              <Image src="/textures/knowledge.png" alt="Knowledge Object" width={30} height={30} className="mr-2 mt-1 sm:mt-0" />
              <span className="italic text-teal-200">{langMessages.collectKOsPrompt}</span>
            </div>
            <hr className="my-3 border-white/20" />
            <p className="text-sm sm:text-base font-semibold mb-2 text-red-300">{langMessages.hazardsText}</p>
            <div className="flex items-center mb-1 text-sm sm:text-base">
              <Image src="/textures/germ.png" alt="Germ" width={30} height={30} className="mr-2" />
              <span className="italic text-red-200">{langMessages.avoidGermsPrompt}</span>
            </div>
            <div className="flex items-center text-sm sm:text-base">
              <Image src="/textures/dust.png" alt="Dust" width={30} height={30} className="mr-2" />
              <span className="italic text-orange-200">{langMessages.avoidDustPrompt}</span>
            </div>
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