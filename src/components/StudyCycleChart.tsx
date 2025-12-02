import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Pause, TrendingUp, Play } from "lucide-react";
import { useState } from "react";
import { Subject } from "@/types/study";

interface StudyCycleChartProps {
  subjects: Subject[];
  onOpenPomodoro: (subject: Subject) => void;
}

const StudyCycleChart = ({ subjects, onOpenPomodoro }: StudyCycleChartProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const totalStudied = subjects.reduce((acc, subject) => acc + subject.studiedMinutes, 0);
  const totalMinutes = subjects.reduce((acc, subject) => acc + subject.totalMinutes, 0);
  const completionPercentage = totalMinutes > 0 ? Math.round((totalStudied / totalMinutes) * 100) : 0;

  const chartData = subjects.map((subject) => ({
    name: subject.name,
    abbreviation: subject.abbreviation,
    value: subject.studiedMinutes || 1, // Ensure minimum value for visibility
    color: subject.color,
    subject: subject,
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleSegmentClick = (entry: any) => {
    setSelectedSubject(entry.subject);
  };

  const renderLabel = (entry: any) => {
    const RADIAN = Math.PI / 180;
    const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold text-sm pointer-events-none"
      >
        {entry.abbreviation}
      </text>
    );
  };

  return (
    <>
      <div className="relative w-full h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              onClick={(_, index) => handleSegmentClick(chartData[index])}
              className="cursor-pointer"
              label={renderLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-4xl font-bold text-foreground">
            {formatTime(totalStudied)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">tempo total</div>
          <div className="text-3xl font-bold text-primary mt-2">
            {completionPercentage}%
          </div>
        </div>
      </div>

      <Dialog open={!!selectedSubject} onOpenChange={(open) => !open && setSelectedSubject(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedSubject?.color }}
              />
              <DialogTitle>{selectedSubject?.name}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Tempo Estudado</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatTime(selectedSubject?.studiedMinutes || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Pause className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Tempo de Pausas</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatTime(selectedSubject?.breakMinutes || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Estudo Líquido</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatTime(
                    (selectedSubject?.studiedMinutes || 0) - (selectedSubject?.breakMinutes || 0)
                  )}
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                if (selectedSubject) {
                  onOpenPomodoro(selectedSubject);
                  setSelectedSubject(null);
                }
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Pomodoro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyCycleChart;
