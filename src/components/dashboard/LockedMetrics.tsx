import { Link } from "react-router-dom";
import { BarChart3, Lock, TrendingUp, Target, Brain, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Subject, StudySession } from "@/types/study";
import { BattleHistory } from "@/types/question";
import { UserProgress } from "@/hooks/useUserProgress";
import { useMemo } from "react";

interface LockedMetricsProps {
  userLevel: number;
  subjects: Subject[];
  sessions: StudySession[];
  battleHistory: BattleHistory[];
  progress: UserProgress;
}

interface MetricUnlock {
  level: number;
  name: string;
  icon: React.ElementType;
  component: React.ReactNode;
}

const LockedMetrics = ({ userLevel, subjects, sessions, battleHistory, progress }: LockedMetricsProps) => {
  const metricUnlocks: MetricUnlock[] = [
    {
      level: 3,
      name: "Progresso por Matéria",
      icon: BarChart3,
      component: <SubjectProgressMetric subjects={subjects} />,
    },
    {
      level: 5,
      name: "Análise de Desempenho",
      icon: TrendingUp,
      component: <PerformanceAnalysisMetric battleHistory={battleHistory} progress={progress} />,
    },
    {
      level: 8,
      name: "Metas Inteligentes",
      icon: Target,
      component: <SmartGoalsMetric battleHistory={battleHistory} />,
    },
    {
      level: 12,
      name: "Insights Avançados",
      icon: Brain,
      component: <AdvancedInsightsMetric sessions={sessions} battleHistory={battleHistory} />,
    },
  ];

  const unlockedMetrics = metricUnlocks.filter(m => userLevel >= m.level);
  const nextLockedMetric = metricUnlocks.find(m => userLevel < m.level);

  if (unlockedMetrics.length === metricUnlocks.length) {
    return (
      <div className="mb-24 space-y-4">
        {unlockedMetrics.map((metric) => (
          <div key={metric.name}>{metric.component}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-24 space-y-4">
      {unlockedMetrics.map((metric) => (
        <div key={metric.name}>{metric.component}</div>
      ))}

      {nextLockedMetric && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <nextLockedMetric.icon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{nextLockedMetric.name}</h2>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 opacity-20 blur-sm p-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg" />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Desbloqueia no Nível {nextLockedMetric.level}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-3">
                Continue estudando para desbloquear {nextLockedMetric.name.toLowerCase()}!
              </p>
              <div className="w-48 mb-4">
                <Progress value={(userLevel / nextLockedMetric.level) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Nível {userLevel} / {nextLockedMetric.level}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/coliseu">Ganhar XP</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// === Sub-components ===

const SubjectProgressMetric = ({ subjects }: { subjects: Subject[] }) => {
  const subjectData = useMemo(() => {
    return subjects.map(s => ({
      name: s.name,
      progress: s.totalMinutes > 0 ? Math.round((s.studiedMinutes / s.totalMinutes) * 100) : 0,
      color: s.color,
    }));
  }, [subjects]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Progresso por Matéria</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 3</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        {subjectData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">Nenhuma matéria cadastrada</p>
        ) : (
          <div className="space-y-3">
            {subjectData.map((subject) => (
              <div key={subject.name} className="flex items-center gap-3">
                <span className="text-sm w-24 truncate">{subject.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10">{subject.progress}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PerformanceAnalysisMetric = ({ battleHistory, progress }: { battleHistory: BattleHistory[]; progress: UserProgress }) => {
  const { hitRate, weeklyImprovement } = useMemo(() => {
    const rate = progress.totalQuestionsAnswered > 0
      ? Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100)
      : 0;

    // Weekly improvement: compare this week vs last week hit rate
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const thisWeek = battleHistory.filter(b => new Date(b.date) >= startOfWeek);
    const lastWeek = battleHistory.filter(b => {
      const d = new Date(b.date);
      return d >= startOfLastWeek && d < startOfWeek;
    });

    const thisWeekRate = thisWeek.length > 0
      ? thisWeek.reduce((a, b) => a + b.correctAnswers, 0) / thisWeek.reduce((a, b) => a + b.totalQuestions, 0) * 100
      : 0;
    const lastWeekRate = lastWeek.length > 0
      ? lastWeek.reduce((a, b) => a + b.correctAnswers, 0) / lastWeek.reduce((a, b) => a + b.totalQuestions, 0) * 100
      : 0;

    const improvement = lastWeekRate > 0 ? Math.round(thisWeekRate - lastWeekRate) : 0;

    return { hitRate: rate, weeklyImprovement: improvement };
  }, [battleHistory, progress]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-success" />
        <h2 className="text-lg font-semibold text-foreground">Análise de Desempenho</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 5</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <p className={`text-2xl font-bold ${weeklyImprovement >= 0 ? 'text-success' : 'text-destructive'}`}>
              {weeklyImprovement > 0 ? '+' : ''}{weeklyImprovement}%
            </p>
            <p className="text-xs text-muted-foreground">Melhora semanal</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <p className="text-2xl font-bold text-primary">{hitRate}%</p>
            <p className="text-xs text-muted-foreground">Taxa de acerto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartGoalsMetric = ({ battleHistory }: { battleHistory: BattleHistory[] }) => {
  const { weeklyGoal, questionsThisWeek, percentage } = useMemo(() => {
    if (battleHistory.length === 0) return { weeklyGoal: 0, questionsThisWeek: 0, percentage: 0 };

    // Calculate average questions per week
    const dates = battleHistory.map(b => new Date(b.date).getTime());
    const earliest = Math.min(...dates);
    const totalWeeks = Math.max(1, Math.ceil((Date.now() - earliest) / (7 * 86400000)));
    const totalQuestions = battleHistory.reduce((a, b) => a + b.totalQuestions, 0);
    const avgPerWeek = Math.ceil(totalQuestions / totalWeeks);
    const goal = Math.max(10, avgPerWeek); // minimum goal of 10

    // Questions this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekQuestions = battleHistory
      .filter(b => new Date(b.date) >= startOfWeek)
      .reduce((a, b) => a + b.totalQuestions, 0);

    return {
      weeklyGoal: goal,
      questionsThisWeek: thisWeekQuestions,
      percentage: Math.min(100, Math.round((thisWeekQuestions / goal) * 100)),
    };
  }, [battleHistory]);

  const remaining = Math.max(0, weeklyGoal - questionsThisWeek);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold text-foreground">Metas Inteligentes</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 8</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Meta Semanal</p>
            <p className="text-sm text-muted-foreground">
              {remaining > 0 ? `${remaining} questões restantes` : "Meta atingida! 🎉"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-warning">{percentage}%</p>
            <p className="text-xs text-muted-foreground">{questionsThisWeek}/{weeklyGoal}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedInsightsMetric = ({ sessions, battleHistory }: { sessions: StudySession[]; battleHistory: BattleHistory[] }) => {
  const { bestTime, strongestSubject } = useMemo(() => {
    // Best study time: group sessions by hour
    let bestHour = "—";
    if (sessions.length > 0) {
      const hourCounts: Record<number, number> = {};
      sessions.forEach(s => {
        const hour = new Date(s.date).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + s.focusMinutes;
      });
      const peakHour = Object.entries(hourCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
      if (peakHour) {
        const h = Number(peakHour[0]);
        bestHour = `${h}h-${h + 2}h`;
      }
    }

    // Strongest subject: highest hit rate in battles
    let strongest = "—";
    if (battleHistory.length > 0) {
      const subjectStats: Record<string, { correct: number; total: number }> = {};
      battleHistory.forEach(b => {
        if (!subjectStats[b.subject]) subjectStats[b.subject] = { correct: 0, total: 0 };
        subjectStats[b.subject].correct += b.correctAnswers;
        subjectStats[b.subject].total += b.totalQuestions;
      });
      const best = Object.entries(subjectStats)
        .filter(([, s]) => s.total >= 5) // minimum 5 questions
        .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))[0];
      if (best) strongest = best[0];
    }

    return { bestTime: bestHour, strongestSubject: strongest };
  }, [sessions, battleHistory]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-chart-4" />
        <h2 className="text-lg font-semibold text-foreground">Insights Avançados</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 12</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-chart-4" />
            <p className="text-sm">Melhor horário de estudo: <span className="font-medium">{bestTime}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-chart-4" />
            <p className="text-sm">Matéria mais forte: <span className="font-medium">{strongestSubject}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedMetrics;
