import { Flame, Target, HelpCircle, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

export type TrendDirection = "up" | "down" | "stable";

interface StatsGridProps {
  streak: number;
  recordStreak: number;
  focusPercentage: number;
  questionsAnswered: number;
  questionsToday: number;
  studyHours: number;
  streakTrend?: TrendDirection;
  questionsTrend?: TrendDirection;
  focusTrend?: TrendDirection;
  hoursTrend?: TrendDirection;
}

const TrendIcon = ({ trend }: { trend?: TrendDirection }) => {
  if (!trend || trend === "stable") return <Minus className="w-3 h-3 text-muted-foreground" />;
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-success" />;
  return <TrendingDown className="w-3 h-3 text-destructive" />;
};

const getFireEmoji = (streak: number) => {
  if (streak >= 7) return "🔥🔥🔥";
  if (streak >= 4) return "🔥🔥";
  if (streak >= 1) return "🔥";
  return "";
};

const StatsGrid = ({
  streak,
  recordStreak,
  focusPercentage,
  questionsAnswered,
  questionsToday,
  studyHours,
  streakTrend,
  questionsTrend,
  focusTrend,
  hoursTrend,
}: StatsGridProps) => {
  const stats = [
    {
      icon: Flame,
      label: "Ofensiva",
      value: streak,
      unit: "dias",
      subtitle: `Recorde: ${recordStreak} dias ${getFireEmoji(streak)}`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      trend: streakTrend,
    },
    {
      icon: Target,
      label: "Foco",
      value: focusPercentage,
      unit: "%",
      subtitle: "Dias ativos / 7",
      color: "text-info",
      bgColor: "bg-info/10",
      trend: focusTrend,
    },
    {
      icon: HelpCircle,
      label: "Questões",
      value: questionsAnswered,
      unit: "",
      subtitle: `+${questionsToday} hoje`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      trend: questionsTrend,
    },
    {
      icon: Clock,
      label: "Horas",
      value: studyHours,
      unit: "h",
      subtitle: "Total estudado",
      color: "text-success",
      bgColor: "bg-success/10",
      trend: hoursTrend,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-2xl p-4 border border-border"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <TrendIcon trend={stat.trend} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
