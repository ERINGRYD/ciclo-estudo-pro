export interface Question {
  id: number;
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  banca: string;
  year: number;
  cargo: string;
  instituicao: string;
  title: string;
  text: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
}

export interface QuestionResult {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  confidence: "certeza" | "duvida" | "chute";
  xpEarned: number;
  timeSpent: number;
}

export interface BattleConfig {
  subject: string;
  enemyName: string;
  totalQuestions: number;
  mode?: string;
}

export interface BattleResult {
  totalQuestions: number;
  correctAnswers: number;
  totalXP: number;
  totalTime: number;
  results: QuestionResult[];
}

export interface BattleHistory {
  id: string;
  date: string;
  subject: string;
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  totalTime: number;
  isVictory: boolean;
  wrongQuestionIds: number[];
}
