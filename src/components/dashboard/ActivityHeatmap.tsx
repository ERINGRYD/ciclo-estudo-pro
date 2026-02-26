import { useMemo, useEffect, useState, useCallback } from "react";
import { StudySession } from "@/types/study";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const dayDetails = useMemo(() => {
    const result: { date: Date; sessions: number; battles: number; minutes: number; value: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 69; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toDateString();

      const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dateString);
      const sessionsCount = daySessions.length;
      const minutesStudied = daySessions.reduce((acc, s) => acc + (s.focusMinutes || 0), 0);

      const battlesCount = battles.filter(b => new Date(b.date).toDateString() === dateString).length;

      const totalActivity = sessionsCount + battlesCount;
      let value = 0;
      if (totalActivity === 1) value = 1;
      else if (totalActivity === 2) value = 2;
      else if (totalActivity <= 4) value = 3;
      else if (totalActivity > 4) value = 4;

      result.push({ date: checkDate, sessions: sessionsCount, battles: battlesCount, minutes: minutesStudied, value });
    }

    return result;
  }, [sessions, battles]);

  const activityData = useMemo(() => {
    if (data && data.length > 0) return data;
    return dayDetails.map(d => d.value);
  }, [data, dayDetails]);

  const getColor = (value: number) => {
    if (value === 0) return "bg-muted";
    if (value === 1) return "bg-success/20";
    if (value === 2) return "bg-success/40";
    if (value === 3) return "bg-success/60";
    return "bg-success";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
  };

  const getActivityLabel = (value: number) => {
    if (value === 0) return "Nenhuma atividade";
    if (value === 1) return "1 atividade";
    return `${value}+ atividades`;
  };

  // Days active in last 7 days
  const activeDaysLast7 = useMemo(() => {
    return activityData.slice(-7).filter(v => v > 0).length;
  }, [activityData]);

  // Today index highlighting
  const todayIndex = activityData.length - 1;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Atividade</h2>
          <p className="text-xs text-muted-foreground">
            {activeDaysLast7} de 7 dias ativos esta semana
          </p>
        </div>
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
          {activityData.map((value, index) => {
            const detail = dayDetails[index];
            const hasActivity = detail && (detail.sessions > 0 || detail.battles > 0);

            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <button
                    className={`w-3 h-3 rounded-sm ${getColor(value)} transition-colors cursor-pointer hover:ring-1 hover:ring-foreground/30 ${
                      index === todayIndex ? "ring-1 ring-primary ring-offset-1 ring-offset-card" : ""
                    }`}
                    aria-label={detail ? `${formatDate(detail.date)}: ${getActivityLabel(value)}` : getActivityLabel(value)}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3 text-xs" side="top" align="center">
                  {detail ? (
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground capitalize">{formatDate(detail.date)}</p>
                      {hasActivity ? (
                        <>
                          {detail.sessions > 0 && (
                            <p className="text-muted-foreground">📚 {detail.sessions} {detail.sessions === 1 ? "sessão" : "sessões"} · {detail.minutes} min</p>
                          )}
                          {detail.battles > 0 && (
                            <p className="text-muted-foreground">⚔️ {detail.battles} {detail.battles === 1 ? "batalha" : "batalhas"}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">Nenhuma atividade</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sem dados</p>
                  )}
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
