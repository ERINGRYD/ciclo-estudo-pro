import { useState, useEffect, useCallback } from 'react';

export interface UserProgress {
  xp: number;
  level: number;
  title: string;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalBattles: number;
  totalBattleWins: number;
}

interface BattleHistory {
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

const USER_PROGRESS_KEY = 'user-progress';
const BATTLE_HISTORY_KEY = 'battle-history';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
  3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
];

const LEVEL_TITLES = [
  'Recruta',
  'Aprendiz',
  'Estudante',
  'Novato',
  'Dedicado',
  'Focado',
  'Persistente',
  'Guerreiro',
  'Veterano',
  'Estrategista',
  'Mestre',
  'Grão-Mestre',
  'Lendário',
  'Épico',
  'Mítico',
  'Imortal',
  'Divino',
  'Transcendente',
  'Absoluto',
  'Supremo'
];

const getDefaultProgress = (): UserProgress => ({
  xp: 0,
  level: 1,
  title: 'Recruta',
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  totalBattles: 0,
  totalBattleWins: 0,
});

const calculateLevelFromXP = (xp: number): { level: number; title: string } => {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return { level, title };
};

const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[currentLevel];
};

const getXPForCurrentLevel = (currentLevel: number): number => {
  if (currentLevel <= 1) return 0;
  return LEVEL_THRESHOLDS[currentLevel - 1];
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(getDefaultProgress);
  const [battleHistory, setBattleHistory] = useState<BattleHistory[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(USER_PROGRESS_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
      } catch {
        setProgress(getDefaultProgress());
      }
    }

    const savedHistory = localStorage.getItem(BATTLE_HISTORY_KEY);
    if (savedHistory) {
      try {
        setBattleHistory(JSON.parse(savedHistory));
      } catch {
        setBattleHistory([]);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: UserProgress) => {
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  // Save battle history to localStorage
  const saveBattleHistory = useCallback((newHistory: BattleHistory[]) => {
    localStorage.setItem(BATTLE_HISTORY_KEY, JSON.stringify(newHistory));
    setBattleHistory(newHistory);
  }, []);

  // Add XP and recalculate level
  const addXP = useCallback((amount: number) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const { level, title } = calculateLevelFromXP(newXP);
      const newProgress = { ...prev, xp: newXP, level, title };
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  // Spend XP (for purchases) - returns true if successful
  const spendXP = useCallback((amount: number): boolean => {
    let success = false;
    setProgress(prev => {
      if (prev.xp < amount) return prev;
      success = true;
      const newXP = prev.xp - amount;
      const { level, title } = calculateLevelFromXP(newXP);
      const newProgress = { ...prev, xp: newXP, level, title };
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
    return success;
  }, []);

  // Record a battle result
  const recordBattle = useCallback((
    subject: string,
    mode: string,
    totalQuestions: number,
    correctAnswers: number,
    xpEarned: number,
    totalTime: number,
    wrongQuestionIds: number[]
  ) => {
    const isVictory = correctAnswers / totalQuestions >= 0.6;

    const newBattle: BattleHistory = {
      id: `battle-${Date.now()}`,
      date: new Date().toISOString(),
      subject,
      mode,
      totalQuestions,
      correctAnswers,
      xpEarned,
      totalTime,
      isVictory,
      wrongQuestionIds,
    };

    setBattleHistory(prev => {
      const newHistory = [newBattle, ...prev].slice(0, 100); // Keep last 100 battles
      localStorage.setItem(BATTLE_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });

    setProgress(prev => {
      const newXP = prev.xp + xpEarned;
      const { level, title } = calculateLevelFromXP(newXP);
      const newProgress: UserProgress = {
        ...prev,
        xp: newXP,
        level,
        title,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + totalQuestions,
        totalCorrectAnswers: prev.totalCorrectAnswers + correctAnswers,
        totalBattles: prev.totalBattles + 1,
        totalBattleWins: prev.totalBattleWins + (isVictory ? 1 : 0),
      };
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  // Get wrong question IDs from history (for "Operação Resgate")
  const getWrongQuestionIds = useCallback((): number[] => {
    const allWrongIds = battleHistory.flatMap(b => b.wrongQuestionIds);
    return [...new Set(allWrongIds)];
  }, [battleHistory]);

  // Calculate XP progress for current level
  const xpForCurrentLevel = getXPForCurrentLevel(progress.level);
  const xpForNextLevel = getXPForNextLevel(progress.level);
  const xpProgressInLevel = progress.xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const levelProgress = Math.min((xpProgressInLevel / xpNeededForNextLevel) * 100, 100);

  return {
    progress,
    battleHistory,
    addXP,
    spendXP,
    recordBattle,
    getWrongQuestionIds,
    levelProgress,
    xpForNextLevel,
  };
};

export type { BattleHistory };
