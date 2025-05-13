import React from 'react';

// Define the structure based on docs_ai/questions_module.md
interface BaseQuestion {
  id: number;
  text: string;
  type: 'multiple_choice' | 'true_false';
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctAnswer: string;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion;

interface QuestionOverlayProps {
  currentQuestion: Question | null;
  onAnswerSubmit: (answer: string | boolean) => void;
}

const QuestionOverlay: React.FC<QuestionOverlayProps> = ({ currentQuestion, onAnswerSubmit }) => {
  console.log('[QuestionOverlay] Rendering with question:', currentQuestion);
  
  if (!currentQuestion) {
    console.log('[QuestionOverlay] No question provided, returning null');
    return null;
  }

  const handleAnswer = (answer: string | boolean) => {
    console.log('[QuestionOverlay] Answer selected:', answer);
    onAnswerSubmit(answer);
  };

  // Define button styles based on the reference image
  const buttonBaseStyle = "font-semibold py-3 rounded-lg transition duration-200 ease-in-out text-indigo-900";
  const buttonColorStyle = "bg-orange-100 hover:bg-orange-200"; // Using orange tones as approximation for peach

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
      {/* Apply background image, adjust padding, size, and remove default background color */}
      <div className="bg-white p-8 pt-12 pb-10 rounded-lg shadow-xl max-w-lg w-full min-h-[300px]
                    flex flex-col items-center justify-center text-center">
        
        {/* Question Text: Adjusted color and margin */}
        <h2 className="text-2xl font-bold mb-10 text-indigo-900">{currentQuestion.text}</h2>

        {/* Multiple Choice Options */}
        {currentQuestion.type === 'multiple_choice' && (
          <div className="space-y-3 w-3/4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`${buttonBaseStyle} ${buttonColorStyle} block w-full px-4`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {currentQuestion.type === 'true_false' && (
          <div className="flex justify-center space-x-4 w-3/4">
            <button
              onClick={() => handleAnswer(true)}
              className={`${buttonBaseStyle} ${buttonColorStyle} flex-1 px-6`}
            >
              True
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className={`${buttonBaseStyle} ${buttonColorStyle} flex-1 px-6`}
            >
              False
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuestionOverlay; 