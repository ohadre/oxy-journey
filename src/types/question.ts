export type RespiratorySystemTopic = 
  | 'lungs'
  | 'trachea'
  | 'bronchi'
  | 'alveoli'
  | 'diaphragm'
  | 'nose'
  | 'mouth'
  | 'pharynx'
  | 'larynx';

export type QuestionType = 'yes_no' | 'multiple_choice';

export type ImagePosition = 'above' | 'below';

export interface QuestionImage {
  path: string;
  position: ImagePosition;
  alt: string;
}

export interface Answer {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  topic: RespiratorySystemTopic;
  questionText: string;
  image?: QuestionImage;
  difficulty: number; // 1-5, will be used later for algorithm
}

export interface YesNoQuestion extends BaseQuestion {
  type: 'yes_no';
  correctAnswer: boolean;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  answers: Answer[];
}

export type Question = YesNoQuestion | MultipleChoiceQuestion;

export interface QuestionHistory {
  questionId: string;
  lastShown: Date;
  timesShown: number;
  timesCorrect: number;
  timesIncorrect: number;
}

export interface QuestionPool {
  questions: Question[];
  history: QuestionHistory[];
} 