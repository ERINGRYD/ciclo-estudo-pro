import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dumbbell, BookOpen, Target, Clock, Zap, Brain, Trophy, Flame } from 'lucide-react';

export interface DailyMission {
  id: string;
  icon: string;
  title: string;
  xp: number;
  description: string;
  current: number;
  target: number;
  iconColor: string;
  iconBg: string;
  type: 'questions' | 'study_time' | 'battles' | 'wins' | 'streak' | 'sessions';
  completed: boolean;
  claimed: boolean;
}

interface DailyMissionsData {
  missions: DailyMission[];
  generatedDate: string;
}

const DAILY_MISSIONS_KEY = 'daily-missions';

const MISSION_TEMPLATES = [
  {
    type: 'questions' as const,
    icon: 'Dumbbell',
    title: 'Treino Intenso',
    descriptionTemplate: 'Responda {target} questões',
    baseTarget: 10,
    baseXP: 30,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    type: 'study_time' as const,
    icon: 'Clock',
    title: 'Foco Total',
    descriptionTemplate: 'Estude por {target} minutos',
    baseTarget: 30,
    baseXP: 40,
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    type: 'battles' as const,
    icon: 'Target',
    title: 'Gladiador',
    descriptionTemplate: 'Complete {target} batalha(s)',
    baseTarget: 1,
    baseXP: 25,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
  },
  {
    type: 'wins' as const,
    icon: 'Trophy',
    title: 'Vitorioso',
    descriptionTemplate: 'Vença {target} batalha(s)',
    baseTarget: 1,
    baseXP: 50,
    iconColor: 'text-chart-1',
    iconBg: 'bg-chart-1/10',
  },
  {
    type: 'sessions' as const,
    icon: 'BookOpen',
    title: 'Estudante Dedicado',
    descriptionTemplate: 'Complete {target} sessão(ões) de estudo',
    baseTarget: 2,
    baseXP: 35,
    iconColor: 'text-chart-2',
    iconBg: 'bg-chart-2/10',
  },
  {
    type: 'streak' as const,
    icon: 'Flame',
    title: 'Consistência',
    descriptionTemplate: 'Mantenha sua sequência de {target} dia(s)',
    baseTarget: 1,
    baseXP: 20,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
  },
];

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Dumbbell, BookOpen, Target, Clock, Zap, Brain, Trophy, Flame
  };
  return icons[iconName] || Dumbbell;
};

const generateDailyMissions = (userLevel: number): DailyMission[] => {
  // Select 2-3 random missions based on level
  const numMissions = userLevel >= 5 ? 3 : 2;
  const shuffled = [...MISSION_TEMPLATES].sort(() => Math.random() - 0.5);
  const selectedTemplates = shuffled.slice(0, numMissions);

  // Scale difficulty based on level
  const levelMultiplier = 1 + (userLevel - 1) * 0.15;

  return selectedTemplates.map((template, index) => {
    const scaledTarget = Math.ceil(template.baseTarget * levelMultiplier);
    const scaledXP = Math.ceil(template.baseXP * levelMultiplier);

    return {
      id: `mission-${template.type}-${Date.now()}-${index}`,
      icon: template.icon,
      title: template.title,
      xp: scaledXP,
      description: template.descriptionTemplate.replace('{target}', scaledTarget.toString()),
      current: 0,
      target: scaledTarget,
      iconColor: template.iconColor,
      iconBg: template.iconBg,
      type: template.type,
      completed: false,
      claimed: false,
    };
  });
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getTimeUntilMidnight = (): string => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const useDailyMissions = (userLevel: number) => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [expiresIn, setExpiresIn] = useState(getTimeUntilMidnight());

  // Load or generate missions
  useEffect(() => {
    const today = getTodayDateString();
    const savedData = localStorage.getItem(DAILY_MISSIONS_KEY);

    if (savedData) {
      try {
        const parsed: DailyMissionsData = JSON.parse(savedData);
        if (parsed.generatedDate === today) {
          setMissions(parsed.missions);
          return;
        }
      } catch {}
    }

    // Generate new missions for today
    const newMissions = generateDailyMissions(userLevel);
    const data: DailyMissionsData = {
      missions: newMissions,
      generatedDate: today,
    };
    localStorage.setItem(DAILY_MISSIONS_KEY, JSON.stringify(data));
    setMissions(newMissions);
  }, [userLevel]);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setExpiresIn(getTimeUntilMidnight());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Save missions to localStorage
  const saveMissions = useCallback((updatedMissions: DailyMission[]) => {
    const today = getTodayDateString();
    const data: DailyMissionsData = {
      missions: updatedMissions,
      generatedDate: today,
    };
    localStorage.setItem(DAILY_MISSIONS_KEY, JSON.stringify(data));
    setMissions(updatedMissions);
  }, []);

  // Update mission progress
  const updateMissionProgress = useCallback((
    type: DailyMission['type'],
    amount: number
  ) => {
    setMissions(prev => {
      const updated = prev.map(mission => {
        if (mission.type === type && !mission.completed) {
          const newCurrent = Math.min(mission.current + amount, mission.target);
          const completed = newCurrent >= mission.target;
          return { ...mission, current: newCurrent, completed };
        }
        return mission;
      });
      
      const today = getTodayDateString();
      const data: DailyMissionsData = {
        missions: updated,
        generatedDate: today,
      };
      localStorage.setItem(DAILY_MISSIONS_KEY, JSON.stringify(data));
      
      return updated;
    });
  }, []);

  // Claim mission reward
  const claimMissionReward = useCallback((missionId: string): number => {
    let xpReward = 0;
    
    setMissions(prev => {
      const updated = prev.map(mission => {
        if (mission.id === missionId && mission.completed && !mission.claimed) {
          xpReward = mission.xp;
          return { ...mission, claimed: true };
        }
        return mission;
      });
      
      const today = getTodayDateString();
      const data: DailyMissionsData = {
        missions: updated,
        generatedDate: today,
      };
      localStorage.setItem(DAILY_MISSIONS_KEY, JSON.stringify(data));
      
      return updated;
    });

    return xpReward;
  }, []);

  // Check if all missions are completed
  const allMissionsCompleted = useMemo(() => {
    return missions.length > 0 && missions.every(m => m.completed);
  }, [missions]);

  // Check if all missions are claimed
  const allMissionsClaimed = useMemo(() => {
    return missions.length > 0 && missions.every(m => m.claimed);
  }, [missions]);

  return {
    missions,
    expiresIn,
    updateMissionProgress,
    claimMissionReward,
    allMissionsCompleted,
    allMissionsClaimed,
    getIconComponent,
  };
};
