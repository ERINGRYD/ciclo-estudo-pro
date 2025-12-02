import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Subject {
  name: string;
  studiedMinutes: number;
  totalMinutes: number;
  color: string;
}

interface StudyCycleChartProps {
  subjects: Subject[];
}

const StudyCycleChart = ({ subjects }: StudyCycleChartProps) => {
  const totalStudied = subjects.reduce((acc, subject) => acc + subject.studiedMinutes, 0);
  const totalMinutes = subjects.reduce((acc, subject) => acc + subject.totalMinutes, 0);
  const completionPercentage = totalMinutes > 0 ? Math.round((totalStudied / totalMinutes) * 100) : 0;

  const chartData = subjects.map((subject) => ({
    name: subject.name,
    value: subject.studiedMinutes,
    color: subject.color,
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
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
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-foreground">
          {formatTime(totalStudied)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">tempo total</div>
        <div className="text-3xl font-bold text-primary mt-2">
          {completionPercentage}%
        </div>
      </div>
    </div>
  );
};

export default StudyCycleChart;
