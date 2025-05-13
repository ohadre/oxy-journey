import { Question, QuestionHistory, QuestionPool } from '@/types/question';
import { lungQuestions } from '@/data/question-templates/lungs';

export class QuestionPoolManager {
  private pool: QuestionPool;
  private static instance: QuestionPoolManager;

  private constructor() {
    this.pool = {
      questions: [...lungQuestions], // Add more question sets here as they're created
      history: []
    };
  }

  public static getInstance(): QuestionPoolManager {
    if (!QuestionPoolManager.instance) {
      QuestionPoolManager.instance = new QuestionPoolManager();
    }
    return QuestionPoolManager.instance;
  }

  private findOrCreateHistory(questionId: string): QuestionHistory {
    let history = this.pool.history.find(h => h.questionId === questionId);
    if (!history) {
      history = {
        questionId,
        lastShown: new Date(0),
        timesShown: 0,
        timesCorrect: 0,
        timesIncorrect: 0
      };
      this.pool.history.push(history);
    }
    return history;
  }

  public getRandomQuestion(): Question {
    // Simple random selection for now
    // TODO: Implement more sophisticated selection algorithm based on history and difficulty
    const randomIndex = Math.floor(Math.random() * this.pool.questions.length);
    const question = this.pool.questions[randomIndex];
    
    // Update history
    const history = this.findOrCreateHistory(question.id);
    history.lastShown = new Date();
    history.timesShown++;

    return question;
  }

  public recordAnswer(questionId: string, wasCorrect: boolean): void {
    const history = this.findOrCreateHistory(questionId);
    if (wasCorrect) {
      history.timesCorrect++;
    } else {
      history.timesIncorrect++;
    }
  }

  public getQuestionHistory(questionId: string): QuestionHistory {
    return this.findOrCreateHistory(questionId);
  }
} 