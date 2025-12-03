import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Subject } from "@/types/study";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubjectCardProps {
  subject: Subject;
  onManageTopics: (subject: Subject) => void;
}

const SubjectCard = ({ subject, onManageTopics }: SubjectCardProps) => {
  const { name, studiedMinutes, totalMinutes, color, themes = [] } = subject;
  const [isOpen, setIsOpen] = useState(false);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
        <CollapsibleTrigger asChild>
          <div className="p-5 cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onManageTopics(subject);
                  }}
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
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-5 pb-5 border-t border-border pt-4">
            {themes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum tema cadastrado. Clique em "Temas" para adicionar.
              </p>
            ) : (
              <div className="space-y-3">
                {themes.map((theme) => {
                  const topicsList = theme.topics || [];
                  const themeCompleted = topicsList.filter(t => t.completed).length;
                  const themeTotal = topicsList.length;
                  
                  return (
                    <div key={theme.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{theme.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {themeCompleted}/{themeTotal}
                        </span>
                      </div>
                      {topicsList.length > 0 && (
                        <div className="pl-4 space-y-1">
                          {topicsList.map((topic) => (
                            <div 
                              key={topic.id} 
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                topic.completed 
                                  ? 'bg-success border-success' 
                                  : 'border-muted-foreground'
                              }`}>
                                {topic.completed && (
                                  <Check className="w-3 h-3 text-success-foreground" />
                                )}
                              </div>
                              <span className={topic.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                                {topic.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default SubjectCard;