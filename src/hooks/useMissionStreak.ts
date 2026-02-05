import { useState, useEffect, useCallback } from 'react';

export interface MissionStreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  streakHistory: string[]; // Array of dates when all missions were completed
}

const MISSION_STREAK_KEY = 'mission-streak-data';

const getDefaultStreakData = (): MissionStreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  streakHistory: [],
});

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const useMissionStreak = () => {
  const [streakData, setStreakData] = useState<MissionStreakData>(getDefaultStreakData);

  // Load streak data on mount
  useEffect(() => {
    const saved = localStorage.getItem(MISSION_STREAK_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if streak should be reset (missed a day)
        const today = getTodayDateString();
        const yesterday = getYesterdayDateString();
        
        if (parsed.lastCompletedDate && 
            parsed.lastCompletedDate !== today && 
            parsed.lastCompletedDate !== yesterday) {
          // Streak broken - reset current streak but keep history
          const resetData: MissionStreakData = {
            ...parsed,
            currentStreak: 0,
          };
          localStorage.setItem(MISSION_STREAK_KEY, JSON.stringify(resetData));
          setStreakData(resetData);
        } else {
          setStreakData(parsed);
        }
      } catch {
        setStreakData(getDefaultStreakData());
      }
    }
  }, []);

  // Record daily completion (called when all missions are completed)
  const recordDailyCompletion = useCallback((): { 
    newStreak: number; 
    isNewRecord: boolean;
    milestoneReached: number | null;
  } => {
    const today = getTodayDateString();
    let result = { newStreak: 0, isNewRecord: false, milestoneReached: null as number | null };

    setStreakData(prev => {
      // Already completed today
      if (prev.lastCompletedDate === today) {
        result.newStreak = prev.currentStreak;
        return prev;
      }

      const yesterday = getYesterdayDateString();
      let newStreak: number;

      // Check if this continues the streak
      if (prev.lastCompletedDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      } else if (!prev.lastCompletedDate) {
        // First ever completion
        newStreak = 1;
      } else {
        // Streak was broken, start fresh
        newStreak = 1;
      }

      const newLongest = Math.max(newStreak, prev.longestStreak);
      const isNewRecord = newStreak > prev.longestStreak;

      // Check for milestones
      const milestones = [7, 14, 30, 60, 100];
      const milestoneReached = milestones.find(m => newStreak === m) || null;

      const newData: MissionStreakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastCompletedDate: today,
        streakHistory: [...prev.streakHistory, today].slice(-365), // Keep last year
      };

      localStorage.setItem(MISSION_STREAK_KEY, JSON.stringify(newData));

      result = { newStreak, isNewRecord, milestoneReached };
      return newData;
    });

    return result;
  }, []);

  // Check if today is already completed
  const isTodayCompleted = streakData.lastCompletedDate === getTodayDateString();

  // Get streak achievements status
  const getStreakAchievements = useCallback(() => {
    const milestones = [
      { days: 7, id: 'mission_streak_7', name: 'Semana Perfeita', icon: '🔥', description: 'Complete todas as missões por 7 dias seguidos' },
      { days: 14, id: 'mission_streak_14', name: 'Duas Semanas Implacável', icon: '💪', description: 'Complete todas as missões por 14 dias seguidos' },
      { days: 30, id: 'mission_streak_30', name: 'Mês de Ferro', icon: '🏆', description: 'Complete todas as missões por 30 dias seguidos' },
      { days: 60, id: 'mission_streak_60', name: 'Disciplina de Elite', icon: '👑', description: 'Complete todas as missões por 60 dias seguidos' },
      { days: 100, id: 'mission_streak_100', name: 'Lenda Centenária', icon: '⭐', description: 'Complete todas as missões por 100 dias seguidos' },
    ];

    return milestones.map(milestone => ({
      ...milestone,
      unlocked: streakData.longestStreak >= milestone.days,
      progress: Math.min((streakData.currentStreak / milestone.days) * 100, 100),
      currentProgress: Math.min(streakData.currentStreak, milestone.days),
    }));
  }, [streakData]);

  return {
    streakData,
    recordDailyCompletion,
    isTodayCompleted,
    getStreakAchievements,
  };
};
