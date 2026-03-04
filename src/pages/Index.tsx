import { useEffect, useState, useMemo } from "react";
import { Subject, StudySession, Achievement } from "@/types/study";
import { BattleHistory } from "@/types/question";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDailyMissions } from "@/hooks/useDailyMissions";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";
import BottomNav from "@/components/BottomNav";
import UserHeader from "@/components/dashboard/UserHeader";
import MotivationalQuote from "@/components/dashboard/MotivationalQuote";
import QuickActions from "@/components/dashboard/QuickActions";
import TodaySummary from "@/components/dashboard/TodaySummary";
import NextActionCard from "@/components/dashboard/NextActionCard";
import WeeklyBarChart from "@/components/dashboard/WeeklyBarChart";
import StatsGrid from "@/components/dashboard/StatsGrid";
import type { TrendDirection } from "@/components/dashboard/StatsGrid";
import WeakPointsCard from "@/components/dashboard/WeakPointsCard";
import type { WeakPointTrend } from "@/components/dashboard/WeakPointsCard";
import DailyMissions from "@/components/dashboard/DailyMissions";
import CurrentPlan from "@/components/dashboard/CurrentPlan";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import LockedMetrics from "@/components/dashboard/LockedMetrics";
import EmptyStateCard from "@/components/dashboard/EmptyStateCard";
import NotificationPermissionBanner from "@/components/NotificationPermissionBanner";
import NextRewardCard from "@/components/dashboard/NextRewardCard";
import LevelUpDialog from "@/components/LevelUpDialog";

const STORAGE_KEY = "study-cycle-subjects";
const SESSIONS_STORAGE_KEY = "study-cycle-sessions";
const ACHIEVEMENTS_STORAGE_KEY = "study-cycle-achievements";
const BATTLE_HISTORY_KEY = "battle-history";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [battleHistory, setBattleHistory] = useState<BattleHistory[]>([]);
  const { progress, levelProgress, xpForNextLevel, levelUpInfo, dismissLevelUp } = useUserProgress();
  const { updateMissionProgress } = useDailyMissions(progress.level);

  useEffect(() => {
    const savedSubjects = localStorage.getItem(STORAGE_KEY);
    if (savedSubjects) {
      try { setSubjects(JSON.parse(savedSubjects)); } catch {}
    }

    const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (savedSessions) {
      try { setSessions(JSON.parse(savedSessions)); } catch {}
    }

    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (savedAchievements) {
      try { setAchievements(JSON.parse(savedAchievements)); } catch { setAchievements(ACHIEVEMENTS); }
    } else {
      setAchievements(ACHIEVEMENTS);
    }

    const savedBattles = localStorage.getItem(BATTLE_HISTORY_KEY);
    if (savedBattles) {
      try { setBattleHistory(JSON.parse(savedBattles)); } catch {}
    }
  }, []);

  // === Basic stats ===
  const totalStudiedMinutes = subjects.reduce((acc, s) => acc + s.studiedMinutes, 0);
  const totalHours = Math.floor(totalStudiedMinutes / 60);
  const today = new Date().toDateString();

  const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.focusMinutes, 0);

  // === Last session date ===
  const lastSessionDate = useMemo(() => {
    if (sessions.length === 0) return null;
    return new Date(Math.max(...sessions.map(s => new Date(s.date).getTime())));
  }, [sessions]);

  // === Streak calculation ===
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const sortedDates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let count = 0;
    const now = new Date();
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - i);
      if (sortedDates.includes(checkDate.toDateString())) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [sessions]);

  // === Record streak ===
  const recordStreak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const uniqueDays = [...new Set(sessions.map(s => new Date(s.date).toDateString()))]
      .map(d => new Date(d).getTime()).sort((a, b) => a - b);
    let maxStreak = 1, currentStreak = 1;
    const oneDay = 86400000;
    for (let i = 1; i < uniqueDays.length; i++) {
      if (uniqueDays[i] - uniqueDays[i - 1] <= oneDay) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    return maxStreak;
  }, [sessions]);

  // === Questions today ===
  const questionsToday = useMemo(() => {
    return battleHistory
      .filter(b => new Date(b.date).toDateString() === today)
      .reduce((acc, b) => acc + b.totalQuestions, 0);
  }, [battleHistory, today]);

  // === Today hit rate ===
  const todayHitRate = useMemo(() => {
    const todayBattles = battleHistory.filter(b => new Date(b.date).toDateString() === today);
    const total = todayBattles.reduce((a, b) => a + b.totalQuestions, 0);
    const correct = todayBattles.reduce((a, b) => a + b.correctAnswers, 0);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [battleHistory, today]);

  // === Daily averages ===
  const { avgDailyMinutes, avgDailyQuestions } = useMemo(() => {
    if (sessions.length === 0 && battleHistory.length === 0) return { avgDailyMinutes: 0, avgDailyQuestions: 0 };
    const allDates = [
      ...sessions.map(s => new Date(s.date).getTime()),
      ...battleHistory.map(b => new Date(b.date).getTime()),
    ];
    if (allDates.length === 0) return { avgDailyMinutes: 0, avgDailyQuestions: 0 };
    const earliest = Math.min(...allDates);
    const totalDays = Math.max(1, Math.ceil((Date.now() - earliest) / 86400000));
    const totalMin = sessions.reduce((a, s) => a + s.focusMinutes, 0);
    const totalQ = battleHistory.reduce((a, b) => a + b.totalQuestions, 0);
    return { avgDailyMinutes: totalMin / totalDays, avgDailyQuestions: totalQ / totalDays };
  }, [sessions, battleHistory]);

  // === Focus percentage ===
  const focusPercentage = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const daysWithSessions = new Set(
      sessions.filter(s => new Date(s.date) >= oneWeekAgo).map(s => new Date(s.date).toDateString())
    ).size;
    return Math.round((daysWithSessions / 7) * 100);
  }, [sessions]);

  // === Trends (this week vs last week) ===
  const trends = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const thisWeekSessions = sessions.filter(s => new Date(s.date) >= startOfWeek);
    const lastWeekSessions = sessions.filter(s => {
      const d = new Date(s.date);
      return d >= startOfLastWeek && d < startOfWeek;
    });

    const thisWeekBattles = battleHistory.filter(b => new Date(b.date) >= startOfWeek);
    const lastWeekBattles = battleHistory.filter(b => {
      const d = new Date(b.date);
      return d >= startOfLastWeek && d < startOfWeek;
    });

    const calcTrend = (current: number, previous: number): TrendDirection => {
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "stable";
    };

    const thisWeekDays = new Set(thisWeekSessions.map(s => new Date(s.date).toDateString())).size;
    const lastWeekDays = new Set(lastWeekSessions.map(s => new Date(s.date).toDateString())).size;

    const thisWeekQ = thisWeekBattles.reduce((a, b) => a + b.totalQuestions, 0);
    const lastWeekQ = lastWeekBattles.reduce((a, b) => a + b.totalQuestions, 0);

    const thisWeekHours = thisWeekSessions.reduce((a, s) => a + s.focusMinutes, 0);
    const lastWeekHours = lastWeekSessions.reduce((a, s) => a + s.focusMinutes, 0);

    return {
      streakTrend: calcTrend(streak, streak > 0 ? streak - 1 : 0) as TrendDirection,
      focusTrend: calcTrend(thisWeekDays, lastWeekDays),
      questionsTrend: calcTrend(thisWeekQ, lastWeekQ),
      hoursTrend: calcTrend(thisWeekHours, lastWeekHours),
    };
  }, [sessions, battleHistory, streak]);

  // === Weak points ===
  const weakPoints = useMemo(() => {
    if (battleHistory.length === 0) return [];
    const stats: Record<string, { correct: number; total: number }> = {};
    battleHistory.forEach(b => {
      if (!stats[b.subject]) stats[b.subject] = { correct: 0, total: 0 };
      stats[b.subject].correct += b.correctAnswers;
      stats[b.subject].total += b.totalQuestions;
    });
    return Object.entries(stats)
      .filter(([, s]) => s.total >= 3)
      .map(([subject, s]) => ({
        subject,
        hitRate: Math.round((s.correct / s.total) * 100),
        totalQuestions: s.total,
      }))
      .sort((a, b) => a.hitRate - b.hitRate)
      .slice(0, 3);
  }, [battleHistory]);

  // === Weak point trends ===
  const weakPointTrends = useMemo(() => {
    if (battleHistory.length === 0) return {};
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(oneWeekAgo);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    const result: Record<string, "improving" | "declining" | "stable"> = {};
    weakPoints.forEach(wp => {
      const thisWeek = battleHistory.filter(b => b.subject === wp.subject && new Date(b.date) >= oneWeekAgo);
      const lastWeek = battleHistory.filter(b => b.subject === wp.subject && new Date(b.date) >= twoWeeksAgo && new Date(b.date) < oneWeekAgo);

      const thisRate = thisWeek.length > 0
        ? thisWeek.reduce((a, b) => a + b.correctAnswers, 0) / thisWeek.reduce((a, b) => a + b.totalQuestions, 0)
        : null;
      const lastRate = lastWeek.length > 0
        ? lastWeek.reduce((a, b) => a + b.correctAnswers, 0) / lastWeek.reduce((a, b) => a + b.totalQuestions, 0)
        : null;

      if (thisRate !== null && lastRate !== null) {
        if (thisRate > lastRate + 0.05) result[wp.subject] = "improving";
        else if (thisRate < lastRate - 0.05) result[wp.subject] = "declining";
        else result[wp.subject] = "stable";
      }
    });
    return result;
  }, [battleHistory, weakPoints]);

  // === Subject adherence ===
  const subjectAdherence = useMemo(() => {
    if (sessions.length === 0 || subjects.length === 0) return [];
    const now = new Date();
    const allDates = sessions.map(s => new Date(s.date).getTime());
    const firstDate = new Date(Math.min(...allDates));
    const totalDays = Math.max(1, Math.ceil((now.getTime() - firstDate.getTime()) / 86400000));

    return subjects.map(sub => {
      const subSessions = sessions.filter(s => s.subjectName === sub.name);
      const uniqueDays = new Set(subSessions.map(s => new Date(s.date).toDateString())).size;
      return { name: sub.name, adherence: Math.min(100, Math.round((uniqueDays / totalDays) * 100)) };
    }).sort((a, b) => b.adherence - a.adherence);
  }, [sessions, subjects]);

  // === Smart next action ===
  const nextAction = useMemo(() => {
    if (subjects.length === 0) return null;
    if (weakPoints.length > 0) {
      const weakestSubject = subjects.find(s => s.name === weakPoints[0].subject);
      if (weakestSubject) {
        return { subject: weakestSubject, reason: `Acerto: ${weakPoints[0].hitRate}% — precisa revisar` };
      }
    }
    const lowest = subjects.reduce((low, cur) => {
      const lowRatio = low.studiedMinutes / (low.totalMinutes || 1);
      const curRatio = cur.studiedMinutes / (cur.totalMinutes || 1);
      return curRatio < lowRatio ? cur : low;
    }, subjects[0]);
    const ratio = Math.round((lowest.studiedMinutes / (lowest.totalMinutes || 1)) * 100);
    return { subject: lowest, reason: `Progresso: ${ratio}% — menor avanço` };
  }, [subjects, weakPoints]);

  // === Current plan ===
  const planData = useMemo(() => {
    if (sessions.length === 0) return null;
    const dates = sessions.map(s => new Date(s.date).getTime());
    const firstDate = new Date(Math.min(...dates));
    const now = new Date();
    const diffDays = Math.max(1, Math.ceil((now.getTime() - firstDate.getTime()) / 86400000));
    const currentWeek = Math.max(1, Math.ceil(diffDays / 7));
    const uniqueSessionDays = new Set(sessions.map(s => new Date(s.date).toDateString())).size;
    const adherencePercentage = Math.round((uniqueSessionDays / diffDays) * 100);
    const subjectCount = subjects.length;
    const planName = subjectCount === 0
      ? "Plano Inicial"
      : subjectCount <= 3
        ? `Plano Focado - ${subjectCount} matérias`
        : `Plano Completo - ${subjectCount} matérias`;
    return { planName, currentWeek, adherencePercentage };
  }, [sessions, subjects]);

  // Update streak mission
  useEffect(() => {
    if (streak > 0) updateMissionProgress('streak', streak);
  }, [streak, updateMissionProgress]);

  const isEmpty = subjects.length === 0 && sessions.length === 0 && battleHistory.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <NotificationPermissionBanner />
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <UserHeader
          userName="Campeão"
          level={progress.level}
          levelTitle={progress.title}
          xp={progress.xp}
          levelProgress={levelProgress}
          xpForNextLevel={xpForNextLevel}
          lastSessionDate={lastSessionDate}
        />

        <MotivationalQuote />
        <NextRewardCard
          currentLevel={progress.level}
          currentXP={progress.xp}
          xpForNextLevel={xpForNextLevel}
          levelProgress={levelProgress}
        />
        <QuickActions />

        {isEmpty ? (
          <EmptyStateCard
            hasSubjects={subjects.length > 0}
            hasSessions={sessions.length > 0}
            hasBattles={battleHistory.length > 0}
          />
        ) : (
          <>
            <TodaySummary
              todayMinutes={todayMinutes}
              questionsToday={questionsToday}
              todayHitRate={todayHitRate}
              avgDailyMinutes={avgDailyMinutes}
              avgDailyQuestions={avgDailyQuestions}
            />

            <NextActionCard
              subjectName={nextAction?.subject.name ?? ""}
              subjectArea="Estudos"
              cycleNumber={1}
              reason={nextAction?.reason}
              isEmpty={subjects.length === 0}
            />

            <WeeklyBarChart sessions={sessions} />

            <StatsGrid
              streak={streak}
              recordStreak={recordStreak}
              focusPercentage={focusPercentage}
              questionsAnswered={progress.totalQuestionsAnswered}
              questionsToday={questionsToday}
              studyHours={totalHours}
              streakTrend={trends.streakTrend}
              questionsTrend={trends.questionsTrend}
              focusTrend={trends.focusTrend}
              hoursTrend={trends.hoursTrend}
            />

            <WeakPointsCard weakPoints={weakPoints} trends={weakPointTrends} />
          </>
        )}

        <DailyMissions userLevel={progress.level} />

        {planData && (
          <CurrentPlan
            planName={planData.planName}
            validUntil="—"
            currentWeek={planData.currentWeek}
            adherencePercentage={planData.adherencePercentage}
            subjectAdherence={subjectAdherence}
          />
        )}

        {!isEmpty && <ActivityHeatmap />}

        <LockedMetrics
          userLevel={progress.level}
          subjects={subjects}
          sessions={sessions}
          battleHistory={battleHistory}
          progress={progress}
        />
      </div>

      <BottomNav />

      {levelUpInfo && (
        <LevelUpDialog
          open={!!levelUpInfo}
          onClose={dismissLevelUp}
          newLevel={levelUpInfo.level}
          newTitle={levelUpInfo.title}
        />
      )}
    </div>
  );
};

export default Index;
