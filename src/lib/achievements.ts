import { Subject, WeeklyGoal, Achievement } from "@/types/study";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_session",
    name: "Primeira Sessão",
    description: "Complete sua primeira sessão de estudos",
    icon: "🎯",
    unlockedAt: null,
    condition: (subjects) => subjects.some(s => s.studiedMinutes > 0),
  },
  {
    id: "week_warrior",
    name: "Guerreiro Semanal",
    description: "Complete todas as metas da semana",
    icon: "⭐",
    unlockedAt: null,
    condition: (_, goals) => goals.length > 0 && goals.every(g => g.completed),
  },
  {
    id: "ten_hours",
    name: "Maratonista",
    description: "Estude 10 horas ou mais",
    icon: "🏃",
    unlockedAt: null,
    condition: (subjects) => {
      const total = subjects.reduce((acc, s) => acc + s.studiedMinutes, 0);
      return total >= 600; // 10 hours
    },
  },
  {
    id: "all_subjects",
    name: "Dedicado",
    description: "Estude todas as matérias pelo menos uma vez",
    icon: "📚",
    unlockedAt: null,
    condition: (subjects) => subjects.length > 0 && subjects.every(s => s.studiedMinutes > 0),
  },
  {
    id: "streak_7",
    name: "Uma Semana",
    description: "Estude por 7 dias consecutivos",
    icon: "🔥",
    unlockedAt: null,
    condition: () => false, // Will be implemented with date tracking
  },
  {
    id: "perfect_focus",
    name: "Foco Perfeito",
    description: "Complete 5 sessões Pomodoro sem pausas extras",
    icon: "💎",
    unlockedAt: null,
    condition: () => false, // Will be implemented with session tracking
  },
];

export const checkAchievements = (
  subjects: Subject[],
  goals: WeeklyGoal[],
  currentAchievements: Achievement[]
): Achievement[] => {
  return currentAchievements.map(achievement => {
    if (achievement.unlockedAt) return achievement;
    
    const unlocked = achievement.condition(subjects, goals);
    if (unlocked) {
      return {
        ...achievement,
        unlockedAt: new Date().toISOString(),
      };
    }
    return achievement;
  });
};
