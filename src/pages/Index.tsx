import { useEffect, useState, useMemo } from "react";
import { Subject, StudySession, Achievement } from "@/types/study";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyMissions } from "@/hooks/useDailyMissions";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";
import BottomNav from "@/components/BottomNav";
import UserHeader from "@/components/dashboard/UserHeader";
import NextActionCard from "@/components/dashboard/NextActionCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import DailyMissions from "@/components/dashboard/DailyMissions";
import CurrentPlan from "@/components/dashboard/CurrentPlan";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import LockedMetrics from "@/components/dashboard/LockedMetrics";
import NotificationPermissionBanner from "@/components/NotificationPermissionBanner";

const STORAGE_KEY = "study-cycle-subjects";
const SESSIONS_STORAGE_KEY = "study-cycle-sessions";
const ACHIEVEMENTS_STORAGE_KEY = "study-cycle-achievements";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { progress } = useUserProgress();
  const { updateMissionProgress } = useDailyMissions(progress.level);

  useEffect(() => {
    const savedSubjects = localStorage.getItem(STORAGE_KEY);
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch {}
    }

    const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch {}
    }

    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch {
        setAchievements(ACHIEVEMENTS);
      }
    } else {
      setAchievements(ACHIEVEMENTS);
    }
  }, []);

  // Calculate stats
  const totalStudiedMinutes = subjects.reduce((acc, s) => acc + s.studiedMinutes, 0);
  const totalHours = Math.floor(totalStudiedMinutes / 60);
  
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.date).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });
  
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.focusMinutes, 0);

  // Calculate streak (simplified - count consecutive days with sessions)
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    
    const sortedDates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      if (sortedDates.includes(checkDate.toDateString())) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  }, [sessions]);

  // Update streak mission when streak changes
  useEffect(() => {
    if (streak > 0) {
      updateMissionProgress('streak', streak);
    }
  }, [streak, updateMissionProgress]);
  const nextSubject = useMemo(() => {
    if (subjects.length === 0) return null;
    
    return subjects.reduce((lowest, current) => {
      const lowestRatio = lowest.studiedMinutes / (lowest.totalMinutes || 1);
      const currentRatio = current.studiedMinutes / (current.totalMinutes || 1);
      return currentRatio < lowestRatio ? current : lowest;
    }, subjects[0]);
  }, [subjects]);

  // Calculate focus percentage (sessions this week / 7)
  const focusPercentage = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const daysWithSessions = new Set(
      sessions
        .filter(s => new Date(s.date) >= oneWeekAgo)
        .map(s => new Date(s.date).toDateString())
    ).size;
    
    return Math.round((daysWithSessions / 7) * 100);
  }, [sessions]);

  return (
    <div className="min-h-screen bg-background">
      <NotificationPermissionBanner />
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <UserHeader
          userName="Campeão"
          level={progress.level}
          levelTitle={progress.title}
          xp={progress.xp}
        />

        {nextSubject ? (
          <NextActionCard
            subjectName={nextSubject.name}
            subjectArea="Estudos"
            cycleNumber={1}
          />
        ) : (
          <NextActionCard
            subjectName="Geometria Espacial"
            subjectArea="Matemática"
            cycleNumber={2}
          />
        )}

        <StatsGrid
          streak={streak || 5}
          recordStreak={12}
          focusPercentage={focusPercentage || 85}
          questionsAnswered={progress.totalQuestionsAnswered || 124}
          questionsToday={Math.round(todayMinutes / 5) || 12}
          studyHours={totalHours || 26}
        />

        <DailyMissions userLevel={progress.level} />

        <CurrentPlan
          planName="ESA 2024 - Elite"
          validUntil="Dez 2024"
          currentWeek={14}
          adherencePercentage={92}
        />

        <ActivityHeatmap />

        <LockedMetrics userLevel={progress.level} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
