import { useMemo, useEffect, useState } from "react";
import { StudySession } from "@/types/study";

const SESSIONS_STORAGE_KEY = "study-cycle-sessions";
const BATTLE_HISTORY_KEY = "battle-history";

interface ActivityHeatmapProps {
  data?: number[];
}

const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [battles, setBattles] = useState<any[]>([]);

  useEffect(() => {
    const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch {}
    }

    const savedBattles = localStorage.getItem(BATTLE_HISTORY_KEY);
    if (savedBattles) {
      try {
        setBattles(JSON.parse(savedBattles));
      } catch {}
    }
  }, []);

  const activityData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Generate activity data for the last 70 days based on real data
    const result: number[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 69; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();

      // Count activities for this day
      const sessionsOnDay = sessions.filter(s => 
        new Date(s.date).toDateString() === dateString
      ).length;

      const battlesOnDay = battles.filter(b => 
        new Date(b.date).toDateString() === dateString
      ).length;

      const totalActivity = sessionsOnDay + battlesOnDay;

      // Map to 0-4 scale
      if (totalActivity === 0) result.push(0);
      else if (totalActivity === 1) result.push(1);
      else if (totalActivity === 2) result.push(2);
      else if (totalActivity <= 4) result.push(3);
      else result.push(4);
    }

    return result;
  }, [data, sessions, battles]);

  const getColor = (value: number) => {
    if (value === 0) return "bg-muted";
    if (value === 1) return "bg-success/20";
    if (value === 2) return "bg-success/40";
    if (value === 3) return "bg-success/60";
    return "bg-success";
  };

  const getActivityLabel = (value: number) => {
    if (value === 0) return "Nenhuma atividade";
    if (value === 1) return "1 atividade";
    return `${value}+ atividades`;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">Atividade</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-success/20" />
            <div className="w-3 h-3 rounded-sm bg-success/40" />
            <div className="w-3 h-3 rounded-sm bg-success/60" />
            <div className="w-3 h-3 rounded-sm bg-success" />
          </div>
          <span>Mais</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 border border-border overflow-x-auto">
        <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-fit">
          {activityData.map((value, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${getColor(value)} transition-colors`}
              title={getActivityLabel(value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
