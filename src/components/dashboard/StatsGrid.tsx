import { Flame, Target, HelpCircle, Clock } from "lucide-react";

interface StatsGridProps {
  streak: number;
  recordStreak: number;
  focusPercentage: number;
  questionsAnswered: number;
  questionsToday: number;
  studyHours: number;
}

const StatsGrid = ({
  streak,
  recordStreak,
  focusPercentage,
  questionsAnswered,
  questionsToday,
  studyHours,
}: StatsGridProps) => {
  const stats = [
    {
      icon: Flame,
      label: "Ofensiva",
      value: streak,
      unit: "dias",
      subtitle: `Recorde: ${recordStreak} dias`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Target,
      label: "Foco",
      value: focusPercentage,
      unit: "%",
      subtitle: "Média semanal",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      icon: HelpCircle,
      label: "Questões",
      value: questionsAnswered,
      unit: "",
      subtitle: `+${questionsToday} hoje`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Clock,
      label: "Horas",
      value: studyHours,
      unit: "h",
      subtitle: "Ciclo atual",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-2xl p-4 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-sm text-muted-foreground">{stat.label}</span>
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
