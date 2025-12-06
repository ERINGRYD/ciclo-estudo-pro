import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, FileText, BookOpen, Trash2, Filter, X } from "lucide-react";
import { StudySession } from "@/types/study";
import { format, isSameDay, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudyHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  sessions: StudySession[];
  onDeleteSession: (sessionId: string) => void;
}

const StudyHistoryDialog = ({ open, onClose, sessions, onDeleteSession }: StudyHistoryDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [themeFilter, setThemeFilter] = useState<string>("all");

  // Get unique subjects from sessions
  const uniqueSubjects = useMemo(() => {
    const subjects = new Map<string, string>();
    sessions.forEach(session => {
      subjects.set(session.subjectName, session.subjectColor);
    });
    return Array.from(subjects.entries()).map(([name, color]) => ({ name, color }));
  }, [sessions]);

  // Get unique themes for selected subject
  const uniqueThemes = useMemo(() => {
    const themes = new Set<string>();
    sessions.forEach(session => {
      if (session.themeName && (subjectFilter === "all" || session.subjectName === subjectFilter)) {
        themes.add(session.themeName);
      }
    });
    return Array.from(themes);
  }, [sessions, subjectFilter]);

  const datesWithSessions = useMemo(() => {
    const dates = new Set<string>();
    sessions.forEach(session => {
      dates.add(format(parseISO(session.date), "yyyy-MM-dd"));
    });
    return dates;
  }, [sessions]);

  // Filter sessions based on all criteria
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Subject filter
      if (subjectFilter !== "all" && session.subjectName !== subjectFilter) {
        return false;
      }
      
      // Theme filter
      if (themeFilter !== "all" && session.themeName !== themeFilter) {
        return false;
      }
      
      // Single date filter
      if (selectedDate && !isSameDay(parseISO(session.date), selectedDate)) {
        return false;
      }
      
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const sessionDate = parseISO(session.date);
        if (!isWithinInterval(sessionDate, { 
          start: startOfDay(dateRange.from), 
          end: endOfDay(dateRange.to) 
        })) {
          return false;
        }
      } else if (dateRange.from && !dateRange.to) {
        if (!isSameDay(parseISO(session.date), dateRange.from)) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sessions, subjectFilter, themeFilter, selectedDate, dateRange]);

  const totalStats = useMemo(() => {
    const total = filteredSessions.reduce((acc, s) => ({
      focus: acc.focus + s.focusMinutes,
      breaks: acc.breaks + s.breakMinutes,
    }), { focus: 0, breaks: 0 });
    return { ...total, net: total.focus - total.breaks };
  }, [filteredSessions]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const clearFilters = () => {
    setSelectedDate(undefined);
    setDateRange({ from: undefined, to: undefined });
    setSubjectFilter("all");
    setThemeFilter("all");
  };

  const hasActiveFilters = subjectFilter !== "all" || themeFilter !== "all" || selectedDate || dateRange.from;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      setDateRange({ from: undefined, to: undefined });
      return;
    }

    if (!dateRange.from) {
      setDateRange({ from: date, to: undefined });
      setSelectedDate(undefined);
    } else if (!dateRange.to && date > dateRange.from) {
      setDateRange({ ...dateRange, to: date });
    } else {
      setDateRange({ from: date, to: undefined });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Histórico de Sessões
          </DialogTitle>
        </DialogHeader>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-3 py-2 border-b border-border">
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          <Select value={subjectFilter} onValueChange={(v) => { setSubjectFilter(v); setThemeFilter("all"); }}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Matérias</SelectItem>
              {uniqueSubjects.map((subject) => (
                <SelectItem key={subject.name} value={subject.name}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                    {subject.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={themeFilter} onValueChange={setThemeFilter} disabled={uniqueThemes.length === 0}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Temas</SelectItem>
              {uniqueThemes.map((theme) => (
                <SelectItem key={theme} value={theme}>{theme}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}

          {/* Active filters summary */}
          {(dateRange.from || dateRange.to) && (
            <span className="text-xs text-muted-foreground">
              {dateRange.from && dateRange.to 
                ? `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`
                : dateRange.from 
                  ? format(dateRange.from, "dd/MM/yyyy")
                  : ""}
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Calendar */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground mb-2">Clique para selecionar data ou período</p>
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={handleDateSelect}
              locale={ptBR}
              modifiers={{
                hasSession: (date) => datesWithSessions.has(format(date, "yyyy-MM-dd")),
                inRange: (date) => {
                  if (dateRange.from && dateRange.to) {
                    return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
                  }
                  return false;
                },
                rangeStart: (date) => dateRange.from ? isSameDay(date, dateRange.from) : false,
                rangeEnd: (date) => dateRange.to ? isSameDay(date, dateRange.to) : false,
              }}
              modifiersStyles={{
                hasSession: {
                  backgroundColor: "hsl(var(--primary) / 0.2)",
                  fontWeight: "bold",
                },
                inRange: {
                  backgroundColor: "hsl(var(--primary) / 0.3)",
                },
                rangeStart: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                },
                rangeEnd: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                },
              }}
              className="rounded-md border"
            />
            
            {/* Stats Summary */}
            {filteredSessions.length > 0 && (
              <div className="mt-4 w-full p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">
                  {filteredSessions.length} sessão(ões) encontrada(s)
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
              Sessões Filtradas
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              {filteredSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma sessão encontrada com os filtros aplicados
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
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
                        {format(parseISO(session.date), "dd/MM/yyyy", { locale: ptBR })} às {format(parseISO(session.createdAt), "HH:mm", { locale: ptBR })}
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