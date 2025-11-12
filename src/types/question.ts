export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface TestResult {
  id: string;
  date: number;
  mode: 'practice' | 'exam';
  category?: string;
  questions: number[];
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
}
