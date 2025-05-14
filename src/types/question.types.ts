export type LanguageCode = 'en' | 'he';

export interface LocalizedText {
  en: string;
  he: string;
}

export type QuestionType = 'multiple-choice' | 'yes-no' | 'open-question';

// For multiple-choice and yes-no questions
export interface LocalizedAnswerOption {
  text: LocalizedText;
  isCorrect: boolean;
}

export interface Question {
  id: string;               // Unique identifier for the question
  topic: LocalizedText;            // e.g., "Lungs", "Breathing Mechanics", "Nasal Passages"
  type: QuestionType;
  text: LocalizedText;      // Question text is now localized
  options?: LocalizedAnswerOption[]; // Uses LocalizedAnswerOption
  explanation?: LocalizedText;    // Explanation is now localized
  image_url?: string;         // Optional URL for an accompanying image
}

// For displaying a question with strings resolved to a single language
export interface DisplayQuestion {
  id: string;
  topic: string;
  type: QuestionType;
  text: string; // Resolved to current language
  options?: { text: string; isCorrect: boolean }[]; // Options text resolved
  correctOptionIndex?: number; // Added for multiple-choice and yes-no
  explanation?: string; // Resolved
  image_url?: string; // Optional URL for an accompanying image
} 