import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, BookOpen, Trash2 } from "lucide-react";
import { StudySession } from "@/types/study";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudyHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  sessions: StudySession[];
  onDeleteSession: (sessionId: string) => void;
}

const StudyHistoryDialog = ({ open, onClose, sessions, onDeleteSession }: StudyHistoryDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const datesWithSessions = useMemo(() => {
    const dates = new Set<string>();
    sessions.forEach(session => {
      dates.add(format(parseISO(session.date), "yyyy-MM-dd"));
    });
    return dates;
  }, [sessions]);

  const sessionsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return sessions.filter(session => 
      isSameDay(parseISO(session.date), selectedDate)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sessions, selectedDate]);

  const totalStats = useMemo(() => {
    const total = sessionsForSelectedDate.reduce((acc, s) => ({
      focus: acc.focus + s.focusMinutes,
      breaks: acc.breaks + s.breakMinutes,
    }), { focus: 0, breaks: 0 });
    return { ...total, net: total.focus - total.breaks };
  }, [sessionsForSelectedDate]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Histórico de Sessões
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Calendar */}
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              modifiers={{
                hasSession: (date) => datesWithSessions.has(format(date, "yyyy-MM-dd")),
              }}
              modifiersStyles={{
                hasSession: {
                  backgroundColor: "hsl(var(--primary) / 0.2)",
                  fontWeight: "bold",
                },
              }}
              className="rounded-md border"
            />
            
            {/* Day Summary */}
            {selectedDate && sessionsForSelectedDate.length > 0 && (
              <div className="mt-4 w-full p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">
                  {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Foco</p>
                    <p className="font-semibold text-primary">{formatTime(totalStats.focus)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pausas</p>
                    <p className="font-semibold text-warning">{formatTime(totalStats.breaks)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Líquido</p>
                    <p className="font-semibold text-success">{formatTime(totalStats.net)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sessions List */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Sessões {selectedDate && `- ${format(selectedDate, "dd/MM/yyyy")}`}
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              {sessionsForSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma sessão neste dia
                </p>
              ) : (
                <div className="space-y-3">
                  {sessionsForSelectedDate.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border border-border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: session.subjectColor }}
                          />
                          <div>
                            <span className="font-medium text-foreground">
                              {session.subjectName}
                            </span>
                            {session.themeName && (
                              <span className="text-sm text-muted-foreground ml-2">
                                ({session.themeName})
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDeleteSession(session.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">Foco:</span>
                          <span className="font-medium">{session.focusMinutes}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-warning" />
                          <span className="text-muted-foreground">Pausas:</span>
                          <span className="font-medium">{session.breakMinutes}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-success" />
                          <span className="text-muted-foreground">Líquido:</span>
                          <span className="font-medium">{session.focusMinutes - session.breakMinutes}m</span>
                        </div>
                      </div>

                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-muted-foreground">Tipo: </span>
                          <span className="text-foreground">{session.studyType}</span>
                        </p>
                        {session.stoppingPoint !== "Não especificado" && (
                          <p className="flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-1 text-muted-foreground" />
                            <span className="text-foreground">{session.stoppingPoint}</span>
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(session.createdAt), "HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudyHistoryDialog;