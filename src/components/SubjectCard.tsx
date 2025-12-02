import { Progress } from "@/components/ui/progress";

interface SubjectCardProps {
  name: string;
  studiedMinutes: number;
  totalMinutes: number;
  color: string;
}

const SubjectCard = ({ name, studiedMinutes, totalMinutes, color }: SubjectCardProps) => {
  const remainingMinutes = totalMinutes - studiedMinutes;
  const progressPercentage = totalMinutes > 0 ? (studiedMinutes / totalMinutes) * 100 : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-lg text-card-foreground">{name}</h3>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {Math.round(progressPercentage)}%
        </div>
      </div>
      
      <div className="space-y-3">
        <Progress value={progressPercentage} className="h-2" style={{ 
          ['--progress-background' as string]: color 
        } as React.CSSProperties} />
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Estudado: </span>
            <span className="font-medium text-foreground">{formatTime(studiedMinutes)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Falta: </span>
            <span className="font-medium text-foreground">{formatTime(remainingMinutes)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
