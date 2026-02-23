import { BookOpen, HelpCircle, Target, TrendingUp, TrendingDown } from "lucide-react";

interface TodaySummaryProps {
  todayMinutes: number;
  questionsToday: number;
  todayHitRate: number;
  avgDailyMinutes: number;
  avgDailyQuestions: number;
}

const TodaySummary = ({
  todayMinutes,
  questionsToday,
  todayHitRate,
  avgDailyMinutes,
  avgDailyQuestions,
}: TodaySummaryProps) => {
  const minutesAboveAvg = todayMinutes >= avgDailyMinutes;
  const questionsAboveAvg = questionsToday >= avgDailyQuestions;

  const stats = [
    {
      icon: BookOpen,
      label: "Estudado",
      value: `${todayMinutes}min`,
      comparison: avgDailyMinutes > 0
        ? `${minutesAboveAvg ? "↑" : "↓"} Média: ${Math.round(avgDailyMinutes)}min`
        : null,
      isAbove: minutesAboveAvg,
    },
    {
      icon: HelpCircle,
      label: "Questões",
      value: String(questionsToday),
      comparison: avgDailyQuestions > 0
        ? `${questionsAboveAvg ? "↑" : "↓"} Média: ${Math.round(avgDailyQuestions)}`
        : null,
      isAbove: questionsAboveAvg,
    },
    {
      icon: Target,
      label: "Acerto",
      value: `${todayHitRate}%`,
      comparison: null,
      isAbove: todayHitRate >= 60,
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Resumo de Hoje</h2>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-3 border border-border text-center"
          >
            <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            {stat.comparison && (
              <p className={`text-[10px] mt-1 ${stat.isAbove ? "text-success" : "text-destructive"}`}>
                {stat.comparison}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySummary;
