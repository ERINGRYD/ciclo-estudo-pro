import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subject, Theme } from "@/types/study";
import { Play, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ThemePomodoroDialogProps {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
  onStartPomodoro: (subject: Subject, theme?: Theme) => void;
}

const ThemePomodoroDialog = ({ open, onClose, subject, onStartPomodoro }: ThemePomodoroDialogProps) => {
  if (!subject) return null;

  const subjectProgress = (subject.studiedMinutes / subject.totalMinutes) * 100;
  const remainingMinutes = Math.max(0, subject.totalMinutes - subject.studiedMinutes);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
            <DialogTitle>{subject.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Subject Progress */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso do Ciclo</span>
              <span className="font-medium">{Math.min(100, Math.round(subjectProgress))}%</span>
            </div>
            <Progress value={Math.min(100, subjectProgress)} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(subject.studiedMinutes)} estudados</span>
              <span>{formatTime(remainingMinutes)} restantes</span>
            </div>
          </div>

          {/* Start without theme */}
          <Button 
            className="w-full" 
            onClick={() => {
              onStartPomodoro(subject);
              onClose();
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Pomodoro Geral
          </Button>

          {/* Themes list */}
          {subject.themes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ou escolha um tema:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {subject.themes.map((theme) => {
                  const completedTopics = theme.topics.filter(t => t.completed).length;
                  const totalTopics = theme.topics.length;
                  const themeProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
                  
                  return (
                    <Button
                      key={theme.id}
                      variant="outline"
                      className="w-full justify-between h-auto py-3"
                      onClick={() => {
                        onStartPomodoro(subject, theme);
                        onClose();
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{theme.name}</span>
                        {totalTopics > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {completedTopics}/{totalTopics} tópicos completos
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {totalTopics > 0 && (
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${themeProgress}%` }}
                            />
                          </div>
                        )}
                        <Play className="w-4 h-4" />
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {subject.themes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Adicione temas à matéria para estudar por temas específicos
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemePomodoroDialog;
