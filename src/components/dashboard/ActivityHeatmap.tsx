import { useMemo } from "react";

interface ActivityHeatmapProps {
  data?: number[];
}

const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  const activityData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Generate mock data for 70 days (10 weeks)
    return Array.from({ length: 70 }, () => Math.floor(Math.random() * 5));
  }, [data]);

  const getColor = (value: number) => {
    if (value === 0) return "bg-muted";
    if (value === 1) return "bg-success/20";
    if (value === 2) return "bg-success/40";
    if (value === 3) return "bg-success/60";
    return "bg-success";
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
              title={`${value} atividades`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
