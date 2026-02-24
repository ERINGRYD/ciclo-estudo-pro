import { useMemo } from "react";
import { StudySession } from "@/types/study";

interface WeeklyBarChartProps {
  sessions: StudySession[];
}

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const WeeklyBarChart = ({ sessions }: WeeklyBarChartProps) => {
  const { dailyMinutes, maxMinutes, todayIndex } = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0=Sun
    // Monday-based index: Mon=0 ... Sun=6
    const todayIdx = currentDay === 0 ? 6 : currentDay - 1;

    // Find Monday of this week
    const monday = new Date(now);
    monday.setDate(now.getDate() - todayIdx);
    monday.setHours(0, 0, 0, 0);

    const mins = Array(7).fill(0);
    sessions.forEach((s) => {
      const d = new Date(s.date);
      if (d >= monday) {
        const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        if (dayIdx >= 0 && dayIdx < 7) {
          mins[dayIdx] += s.focusMinutes;
        }
      }
    });

    return { dailyMinutes: mins, maxMinutes: Math.max(...mins, 1), todayIndex: todayIdx };
  }, [sessions]);

  const totalWeek = dailyMinutes.reduce((a, b) => a + b, 0);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-muted-foreground">Esta Semana</h2>
        <span className="text-xs text-muted-foreground">{totalWeek} min total</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-end justify-between gap-2 h-20">
          {dailyMinutes.map((mins, i) => {
            const height = maxMinutes > 0 ? (mins / maxMinutes) * 100 : 0;
            const isToday = i === todayIndex;
            const isFuture = i > todayIndex;

            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                {mins > 0 && (
                  <span className="text-[9px] text-muted-foreground">{mins}</span>
                )}
                <div
                  className={`w-full max-w-[24px] rounded-t-md transition-all ${
                    isToday
                      ? "bg-primary"
                      : isFuture
                      ? "bg-muted/50"
                      : mins > 0
                      ? "bg-primary/40"
                      : "bg-muted"
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${DAY_LABELS[i]}: ${mins} min`}
                />
                <span className={`text-[10px] ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {DAY_LABELS[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyBarChart;
