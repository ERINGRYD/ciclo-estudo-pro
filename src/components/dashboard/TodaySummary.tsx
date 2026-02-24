import { BookOpen, HelpCircle, Target, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TodaySummaryProps {
  todayMinutes: number;
  questionsToday: number;
  todayHitRate: number;
  avgDailyMinutes: number;
  avgDailyQuestions: number;
  dailyMinuteGoal?: number;
  dailyQuestionGoal?: number;
}

const TodaySummary = ({
  todayMinutes,
  questionsToday,
  todayHitRate,
  avgDailyMinutes,
  avgDailyQuestions,
  dailyMinuteGoal = 60,
  dailyQuestionGoal = 20,
}: TodaySummaryProps) => {
  const minuteProgress = Math.min((todayMinutes / dailyMinuteGoal) * 100, 100);
  const questionProgress = Math.min((questionsToday / dailyQuestionGoal) * 100, 100);
  const minuteGoalReached = todayMinutes >= dailyMinuteGoal;
  const questionGoalReached = questionsToday >= dailyQuestionGoal;

  const stats = [
    {
      icon: minuteGoalReached ? CheckCircle2 : BookOpen,
      label: "Estudado",
      value: `${todayMinutes}/${dailyMinuteGoal}`,
      unit: "min",
      progress: minuteProgress,
      goalReached: minuteGoalReached,
    },
    {
      icon: questionGoalReached ? CheckCircle2 : HelpCircle,
      label: "Questões",
      value: `${questionsToday}/${dailyQuestionGoal}`,
      unit: "",
      progress: questionProgress,
      goalReached: questionGoalReached,
    },
    {
      icon: Target,
      label: "Acerto",
      value: `${todayHitRate}%`,
      unit: "",
      progress: todayHitRate,
      goalReached: todayHitRate >= 70,
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Resumo de Hoje</h2>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-card rounded-xl p-3 border text-center ${
              stat.goalReached ? "border-success/40 bg-success/5" : "border-border"
            }`}
          >
            <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.goalReached ? "text-success" : "text-primary"}`} />
            <p className={`text-sm font-bold ${stat.goalReached ? "text-success" : "text-foreground"}`}>
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground mb-1.5">{stat.label}</p>
            <Progress
              value={stat.progress}
              className="h-1"
              style={{ '--progress-background': stat.goalReached ? 'hsl(var(--success))' : 'hsl(var(--primary))' } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySummary;
