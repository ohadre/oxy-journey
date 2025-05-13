import React, { useState } from 'react';

interface QuestionSlideProps {
  backgroundImageUrl: string; // Expecting a URL (e.g., from /public)
  title?: string; // Optional title
  questionText: string;
  answerOptions: { text: string; value: any }[]; // Array of options with text and value
  onAnswerSelect: (value: any) => void; // Callback when an answer is selected
  // Optional styling props (future enhancement?)
  // panelBackgroundColor?: string; 
  // buttonColor?: string;
  // textColor?: string;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({
  backgroundImageUrl,
  title,
  questionText,
  answerOptions,
  onAnswerSelect,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any | null>(null);

  const handleAnswer = (value: any) => {
    setSelectedAnswer(value);
    onAnswerSelect(value);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center min-h-screen w-screen bg-black/60">
      {/* Centered Quiz Block */}
      <div className="max-w-md w-[90%] flex flex-col gap-y-8">
        {/* Title Area - Using v0 styling */}
        {title && (
          <div className="px-6 py-3 bg-[#b3dfd8] rounded-full shadow-md text-center w-full">
            <h1 
              className="text-xl font-bold text-[#3a3a7c]"
            >
              {title}
            </h1>
          </div>
        )}
        {/* Question Card - Using v0 styling */}
        <div className="w-full bg-[#f8ecc9] rounded-3xl shadow-lg p-6 border-8 border-[#b3dfd8]">
          <h2
            className="text-center text-[#3a3a7c] text-2xl md:text-3xl font-bold mb-6"
          >
            {questionText}
          </h2>
          {/* Answer Button Row - Using v0 styling */}
          <div className="grid grid-cols-2 gap-4">
            {answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className={`bg-[#ffbea3] hover:bg-[#ffa989] text-[#3a3a7c] text-xl font-bold py-4 rounded-xl shadow-sm transition-all ${
                  selectedAnswer === option.value ? "ring-4 ring-[#3a3a7c]" : ""
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSlide; 