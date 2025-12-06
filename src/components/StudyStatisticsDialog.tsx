import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line } from "recharts";
import { BarChart3, Calendar, TrendingUp, Target, Flame, CheckCircle } from "lucide-react";
import { StudySession, Subject } from "@/types/study";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subDays, subWeeks, subMonths, isWithinInterval, isSameDay, addDays, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudyStatisticsDialogProps {
  open: boolean;
  onClose: () => void;
  sessions: StudySession[];
  subjects: Subject[];
}

const StudyStatisticsDialog = ({ open, onClose, sessions, subjects }: StudyStatisticsDialogProps) => {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Daily data - last 7 days
  const dailyData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    
    return days.map(day => {
      const daySessions = sessions.filter(s => isSameDay(parseISO(s.date), day));
      const focusMinutes = daySessions.reduce((sum, s) => sum + s.focusMinutes, 0);
      const breakMinutes = daySessions.reduce((sum, s) => sum + s.breakMinutes, 0);
      
      return {
        name: format(day, "EEE", { locale: ptBR }),
        fullDate: format(day, "dd/MM"),
        foco: focusMinutes,
        pausas: breakMinutes,
        liquido: focusMinutes - breakMinutes,
      };
    });
  }, [sessions]);

  // Weekly data - last 4 weeks
  const weeklyData = useMemo(() => {
    const today = new Date();
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(today, 3 - i), { locale: ptBR });
      const weekEnd = endOfWeek(subWeeks(today, 3 - i), { locale: ptBR });
      return { start: weekStart, end: weekEnd };
    });
    
    return weeks.map(({ start, end }) => {
      const weekSessions = sessions.filter(s => {
        const date = parseISO(s.date);
        return isWithinInterval(date, { start, end });
      });
      const focusMinutes = weekSessions.reduce((sum, s) => sum + s.focusMinutes, 0);
      const breakMinutes = weekSessions.reduce((sum, s) => sum + s.breakMinutes, 0);
      
      return {
        name: `${format(start, "dd/MM")}`,
        foco: focusMinutes,
        pausas: breakMinutes,
        liquido: focusMinutes - breakMinutes,
      };
    });
  }, [sessions]);

  // Monthly data - last 6 months
  const monthlyData = useMemo(() => {
    const today = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const monthStart = startOfMonth(subMonths(today, 5 - i));
      const monthEnd = endOfMonth(subMonths(today, 5 - i));
      return { start: monthStart, end: monthEnd, month: monthStart };
    });
    
    return months.map(({ start, end, month }) => {
      const monthSessions = sessions.filter(s => {
        const date = parseISO(s.date);
        return isWithinInterval(date, { start, end });
      });
      const focusMinutes = monthSessions.reduce((sum, s) => sum + s.focusMinutes, 0);
      const breakMinutes = monthSessions.reduce((sum, s) => sum + s.breakMinutes, 0);
      
      return {
        name: format(month, "MMM", { locale: ptBR }),
        foco: focusMinutes,
        pausas: breakMinutes,
        liquido: focusMinutes - breakMinutes,
      };
    });
  }, [sessions]);

  // Distribution by subject
  const subjectDistribution = useMemo(() => {
    const distribution: Record<string, { minutes: number; color: string }> = {};
    
    sessions.forEach(session => {
      if (!distribution[session.subjectName]) {
        distribution[session.subjectName] = { 
          minutes: 0, 
          color: session.subjectColor 
        };
      }
      distribution[session.subjectName].minutes += session.focusMinutes;
    });
    
    return Object.entries(distribution)
      .map(([name, data]) => ({
        name,
        value: data.minutes,
        color: data.color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [sessions]);

  // Goals vs Actual comparison
  const goalsComparison = useMemo(() => {
    return subjects.map(subject => {
      const totalGoal = subject.totalMinutes;
      const actual = subject.studiedMinutes;
      const percentage = totalGoal > 0 ? Math.round((actual / totalGoal) * 100) : 0;
      
      return {
        name: subject.abbreviation || subject.name.substring(0, 6),
        fullName: subject.name,
        meta: totalGoal,
        real: actual,
        percentage,
        color: subject.color,
      };
    }).filter(s => s.meta > 0);
  }, [subjects]);

  // Consistency data - last 30 days
  const consistencyData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 30 }, (_, i) => subDays(today, 29 - i));
    
    return days.map(day => {
      const daySessions = sessions.filter(s => isSameDay(parseISO(s.date), day));
      const focusMinutes = daySessions.reduce((sum, s) => sum + s.focusMinutes, 0);
      const hasStudied = focusMinutes > 0;
      
      return {
        date: format(day, "dd/MM"),
        dayName: format(day, "EEE", { locale: ptBR }),
        foco: focusMinutes,
        hasStudied,
        fullDate: day,
      };
    });
  }, [sessions]);

  // Calculate streak and consistency stats
  const consistencyStats = useMemo(() => {
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak (going backwards from today)
    for (let i = 0; i < 365; i++) {
      const day = subDays(today, i);
      const daySessions = sessions.filter(s => isSameDay(parseISO(s.date), day));
      if (daySessions.length > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak in last 30 days
    consistencyData.forEach((day) => {
      if (day.hasStudied) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    
    const daysStudied = consistencyData.filter(d => d.hasStudied).length;
    const consistencyPercent = Math.round((daysStudied / 30) * 100);
    const avgMinutesPerDay = Math.round(
      consistencyData.reduce((sum, d) => sum + d.foco, 0) / 30
    );
    
    return {
      currentStreak,
      longestStreak,
      daysStudied,
      consistencyPercent,
      avgMinutesPerDay,
    };
  }, [sessions, consistencyData]);

  // Total stats
  const totalStats = useMemo(() => {
    const totalFocus = sessions.reduce((sum, s) => sum + s.focusMinutes, 0);
    const totalBreaks = sessions.reduce((sum, s) => sum + s.breakMinutes, 0);
    const totalSessions = sessions.length;
    const avgFocusPerSession = totalSessions > 0 ? Math.round(totalFocus / totalSessions) : 0;
    
    return {
      totalFocus,
      totalBreaks,
      totalNet: totalFocus - totalBreaks,
      totalSessions,
      avgFocusPerSession,
    };
  }, [sessions]);

  const chartData = view === "daily" ? dailyData : view === "weekly" ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatTime(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estatísticas de Estudo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Foco</p>
              <p className="text-xl font-bold text-primary">{formatTime(totalStats.totalFocus)}</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Pausas</p>
              <p className="text-xl font-bold text-warning">{formatTime(totalStats.totalBreaks)}</p>
            </div>
            <div className="bg-success/10 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Tempo Líquido</p>
              <p className="text-xl font-bold text-success">{formatTime(totalStats.totalNet)}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">Sessões</p>
              <p className="text-xl font-bold text-foreground">{totalStats.totalSessions}</p>
            </div>
          </div>

          {/* Consistency Chart */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Consistência de Estudo (Últimos 30 dias)
            </h3>

            {/* Consistency Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-orange-500/10 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-lg font-bold text-orange-500">{consistencyStats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Sequência Atual</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-primary">{consistencyStats.longestStreak}</p>
                <p className="text-xs text-muted-foreground">Maior Sequência</p>
              </div>
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-success">{consistencyStats.daysStudied}/30</p>
                <p className="text-xs text-muted-foreground">Dias Estudados</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">{consistencyStats.consistencyPercent}%</p>
                <p className="text-xs text-muted-foreground">Consistência</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">{formatTime(consistencyStats.avgMinutesPerDay)}</p>
                <p className="text-xs text-muted-foreground">Média/Dia</p>
              </div>
            </div>

            {/* Heatmap-style grid */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Mapa de atividade</p>
              <div className="flex flex-wrap gap-1">
                {consistencyData.map((day, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-sm flex items-center justify-center text-[8px] font-medium transition-all hover:scale-125 cursor-default"
                    style={{
                      backgroundColor: day.hasStudied 
                        ? `hsl(var(--primary) / ${Math.min(0.3 + (day.foco / 120) * 0.7, 1)})` 
                        : 'hsl(var(--muted))',
                      color: day.hasStudied ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                    }}
                    title={`${format(day.fullDate, "dd/MM/yyyy")}: ${day.foco > 0 ? formatTime(day.foco) : 'Sem estudo'}`}
                  >
                    {day.hasStudied && <CheckCircle className="w-3 h-3" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                <span>Menos</span>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }} />
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary) / 0.6)' }} />
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary) / 1)' }} />
                </div>
                <span>Mais</span>
              </div>
            </div>

            {/* Area Chart for daily evolution */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consistencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFoco" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    interval={4}
                  />
                  <YAxis 
                    tickFormatter={(value) => value > 60 ? `${Math.round(value / 60)}h` : `${value}m`}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium text-foreground mb-1">{label}</p>
                            <p className="text-sm text-primary">Foco: {formatTime(payload[0].value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="foco" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorFoco)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Tempo por Período
              </h3>
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList>
                  <TabsTrigger value="daily">Diário</TabsTrigger>
                  <TabsTrigger value="weekly">Semanal</TabsTrigger>
                  <TabsTrigger value="monthly">Mensal</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${Math.round(value / 60)}h`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="foco" name="Foco" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pausas" name="Pausas" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goals vs Actual Comparison */}
          {goalsComparison.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Metas vs Tempo Real
              </h3>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={goalsComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${Math.round(value / 60)}h`}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium text-foreground mb-2">{data.fullName}</p>
                              <p className="text-sm text-muted-foreground">Meta: {formatTime(data.meta)}</p>
                              <p className="text-sm text-primary">Real: {formatTime(data.real)}</p>
                              <p className="text-sm font-medium" style={{ color: data.percentage >= 100 ? 'hsl(var(--success))' : 'hsl(var(--warning))' }}>
                                {data.percentage}% concluído
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="meta" name="Meta" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
                    <Bar dataKey="real" name="Real" radius={[4, 4, 0, 0]}>
                      {goalsComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {goalsComparison.map((subject) => (
                  <div key={subject.fullName} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-sm text-foreground truncate max-w-[120px]">{subject.fullName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{formatTime(subject.real)} / {formatTime(subject.meta)}</span>
                      <span 
                        className="ml-2 text-xs font-bold"
                        style={{ color: subject.percentage >= 100 ? 'hsl(var(--success))' : subject.percentage >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))' }}
                      >
                        {subject.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject Distribution */}
          {subjectDistribution.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Distribuição por Matéria
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatTime(value)}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {subjectDistribution.map((subject) => (
                    <div key={subject.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="text-sm text-foreground">{subject.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{formatTime(subject.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudyStatisticsDialog;
