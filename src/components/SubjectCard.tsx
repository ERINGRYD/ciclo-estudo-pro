import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Subject } from "@/types/study";

interface SubjectCardProps {
  subject: Subject;
  onManageTopics: (subject: Subject) => void;
}

const SubjectCard = ({ subject, onManageTopics }: SubjectCardProps) => {
  const { name, studiedMinutes, totalMinutes, color, themes = [] } = subject;
  const remainingMinutes = totalMinutes - studiedMinutes;
  const progressPercentage = totalMinutes > 0 ? (studiedMinutes / totalMinutes) * 100 : 0;
  
  const totalTopics = themes.reduce((acc, theme) => acc + (theme.topics?.length || 0), 0);
  const completedTopics = themes.reduce(
    (acc, theme) => acc + (theme.topics?.filter(t => t.completed).length || 0),
    0
  );

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
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground">{name}</h3>
            {totalTopics > 0 && (
              <p className="text-xs text-muted-foreground">
                {completedTopics}/{totalTopics} tópicos concluídos
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageTopics(subject)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Temas
          </Button>
          <div className="text-sm font-medium text-muted-foreground">
            {Math.round(progressPercentage)}%
          </div>
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
