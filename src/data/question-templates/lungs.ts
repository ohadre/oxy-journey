import { Question } from '@/types/question';

export const lungQuestions: Question[] = [
  {
    id: 'lungs_001',
    type: 'yes_no',
    topic: 'lungs',
    questionText: 'Are the lungs the main organs of the respiratory system?',
    correctAnswer: true,
    explanation: 'Yes, the lungs are the main organs of the respiratory system. They are responsible for taking in oxygen and removing carbon dioxide from the body.',
    difficulty: 1
  },
  {
    id: 'lungs_002',
    type: 'multiple_choice',
    topic: 'lungs',
    questionText: 'What is the main function of the alveoli in the lungs?',
    image: {
      path: '/images/placeholder.png',
      position: 'above',
      alt: 'Diagram of alveoli in the lungs'
    },
    answers: [
      {
        text: 'To exchange oxygen and carbon dioxide with the blood',
        isCorrect: true,
        explanation: 'The alveoli are tiny air sacs where the exchange of oxygen and carbon dioxide takes place between the air and the blood.'
      },
      {
        text: 'To protect the lungs from germs',
        isCorrect: false,
        explanation: 'While the lungs do have defense mechanisms, the alveoli are specifically designed for gas exchange.'
      },
      {
        text: 'To help the lungs expand and contract',
        isCorrect: false,
        explanation: 'The expansion and contraction of the lungs is primarily controlled by the diaphragm and rib muscles.'
      },
      {
        text: 'To store extra oxygen for when we need it',
        isCorrect: false,
        explanation: 'The lungs don\'t store oxygen. They continuously exchange gases with the blood.'
      }
    ],
    difficulty: 2
  }
]; 