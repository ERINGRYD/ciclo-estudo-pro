import { useState, useEffect } from "react";
import { BookOpen, Settings, Award, Bell, BellOff, History, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudyCycleChart from "@/components/StudyCycleChart";
import SubjectCard from "@/components/SubjectCard";
import PomodoroTimer from "@/components/PomodoroTimer";
import ManageSubjectsDialog from "@/components/ManageSubjectsDialog";
import ManageTopicsDialog from "@/components/ManageTopicsDialog";
import WeeklyGoalsWidget from "@/components/WeeklyGoalsWidget";
import AchievementsDialog from "@/components/AchievementsDialog";
import SessionCompletionDialog from "@/components/SessionCompletionDialog";
import StudyHistoryDialog from "@/components/StudyHistoryDialog";
import AddTimeDialog from "@/components/AddTimeDialog";
import ThemePomodoroDialog from "@/components/ThemePomodoroDialog";
import { Subject, WeeklyGoal, Achievement, StudySession, Theme } from "@/types/study";
import { ACHIEVEMENTS, checkAchievements } from "@/lib/achievements";
import { useToast } from "@/hooks/use-toast";
import { playAchievementSound } from "@/lib/sounds";

const DEFAULT_SUBJECTS: Subject[] = [
  {
    name: "Matemática",
    abbreviation: "MAT",
    studiedMinutes: 120,
    breakMinutes: 15,
    totalMinutes: 180,
    color: "hsl(217, 91%, 60%)",
    themes: [],
  },
  {
    name: "Português",
    abbreviation: "POR",
    studiedMinutes: 90,
    breakMinutes: 10,
    totalMinutes: 150,
    color: "hsl(142, 76%, 36%)",
    themes: [],
  },
  {
    name: "História",
    abbreviation: "HIS",
    studiedMinutes: 60,
    breakMinutes: 8,
    totalMinutes: 120,
    color: "hsl(38, 92%, 50%)",
    themes: [],
  },
  {
    name: "Geografia",
    abbreviation: "GEO",
    studiedMinutes: 45,
    breakMinutes: 5,
    totalMinutes: 90,
    color: "hsl(271, 81%, 56%)",
    themes: [],
  },
  {
    name: "Física",
    abbreviation: "FIS",
    studiedMinutes: 75,
    breakMinutes: 12,
    totalMinutes: 150,
    color: "hsl(339, 82%, 56%)",
    themes: [],
  },
];

const STORAGE_KEY = "study-cycle-subjects";
const GOALS_STORAGE_KEY = "study-cycle-goals";
const ACHIEVEMENTS_STORAGE_KEY = "study-cycle-achievements";
const SESSIONS_STORAGE_KEY = "study-cycle-sessions";
const NOTIFICATIONS_KEY = "study-notifications-enabled";

const Index = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SUBJECTS;
      }
    }
    return DEFAULT_SUBJECTS;
  });

  const [goals, setGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem(GOALS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ACHIEVEMENTS;
      }
    }
    return ACHIEVEMENTS;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved === "true";
  });

  const [pomodoroSubject, setPomodoroSubject] = useState<Subject | null>(null);
  const [pomodoroTheme, setPomodoroTheme] = useState<string | undefined>(undefined);
  const [themePomodoroSubject, setThemePomodoroSubject] = useState<Subject | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [topicsDialogSubject, setTopicsDialogSubject] = useState<Subject | null>(null);
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [addTimeDialogOpen, setAddTimeDialogOpen] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  
  // Session completion state
  const [pendingSession, setPendingSession] = useState<{
    subjectName: string;
    subjectColor: string;
    focusMinutes: number;
    breakMinutes: number;
    themeName?: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Check for new achievements
  useEffect(() => {
    const totalMinutes = subjects.reduce((acc, s) => acc + s.studiedMinutes, 0);
    const updatedAchievements = checkAchievements(subjects, goals, achievements);
    
    // Find newly unlocked achievements
    const newlyUnlocked = updatedAchievements.filter((updated, index) => {
      const old = achievements[index];
      return updated.unlockedAt && !old.unlockedAt;
    });

    if (newlyUnlocked.length > 0) {
      setAchievements(updatedAchievements);
      
      // Play achievement sound
      playAchievementSound();
      
      newlyUnlocked.forEach((achievement) => {
        toast({
          title: "🎉 Nova Conquista!",
          description: `Você desbloqueou: ${achievement.name}`,
        });

        // Browser notification
        if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
          new Notification("Nova Conquista Desbloqueada!", {
            body: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
            icon: "/favicon.ico",
          });
        }
      });
    }
  }, [subjects, goals]);

  const toggleNotifications = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações",
        variant: "destructive",
      });
      return;
    }

    if (Notification.permission === "denied") {
      toast({
        title: "Notificações bloqueadas",
        description: "Você bloqueou as notificações. Ative nas configurações do navegador.",
        variant: "destructive",
      });
      return;
    }

    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notificações ativadas",
          description: "Você receberá notificações sobre conquistas",
        });
      }
    } else {
      setNotificationsEnabled(false);
      toast({
        title: "Notificações desativadas",
        description: "Você não receberá mais notificações",
      });
    }
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(subjects.map(s => 
      s.name === updatedSubject.name ? updatedSubject : s
    ));
  };

  // Check if all subjects have completed their cycle and reset
  const checkAndResetCycle = (currentSubjects: Subject[]) => {
    const allCompleted = currentSubjects.every(s => s.studiedMinutes >= s.totalMinutes);
    if (allCompleted && currentSubjects.length > 0) {
      setCycleCount(prev => prev + 1);
      toast({
        title: "🎉 Ciclo Completo!",
        description: "Todas as matérias atingiram o tempo estimado. Iniciando novo ciclo!",
      });
      return currentSubjects.map(s => ({ ...s, studiedMinutes: 0, breakMinutes: 0 }));
    }
    return currentSubjects;
  };

  const handlePomodoroComplete = (subjectName: string, subjectColor: string, focusMinutes: number, breakMinutes: number, themeName?: string) => {
    // Show session completion dialog
    setPendingSession({
      subjectName,
      subjectColor,
      focusMinutes,
      breakMinutes,
      themeName,
    });
  };

  const handleStartPomodoroFromTheme = (subject: Subject, theme?: Theme) => {
    setPomodoroSubject(subject);
    setPomodoroTheme(theme?.name);
    setThemePomodoroSubject(null);
  };

  const handleSaveSession = (studyType: string, stoppingPoint: string) => {
    if (!pendingSession) return;

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      subjectName: pendingSession.subjectName,
      subjectColor: pendingSession.subjectColor,
      themeName: pendingSession.themeName,
      date: new Date().toISOString(),
      focusMinutes: pendingSession.focusMinutes,
      breakMinutes: pendingSession.breakMinutes,
      studyType,
      stoppingPoint,
      createdAt: new Date().toISOString(),
    };

    setSessions(prev => [...prev, newSession]);
    
    // Update subject studied time and theme time, then check cycle
    setSubjects(prev => {
      const updated = prev.map(s => {
        if (s.name === pendingSession.subjectName) {
          const updatedThemes = (s.themes || []).map(theme => {
            if (pendingSession.themeName && theme.name === pendingSession.themeName) {
              return { ...theme, studiedMinutes: (theme.studiedMinutes || 0) + pendingSession.focusMinutes };
            }
            return theme;
          });
          return { 
            ...s, 
            studiedMinutes: s.studiedMinutes + pendingSession.focusMinutes,
            themes: updatedThemes
          };
        }
        return s;
      });
      return checkAndResetCycle(updated);
    });

    toast({
      title: "Sessão registrada!",
      description: `+${pendingSession.focusMinutes} minutos adicionados a ${pendingSession.subjectName}`,
    });

    setPendingSession(null);
  };

  const handleAddManualTime = (subjectName: string, minutes: number, themeName?: string) => {
    setSubjects(prev => {
      const updated = prev.map(s => {
        if (s.name === subjectName) {
          const updatedThemes = (s.themes || []).map(theme => {
            if (themeName && theme.name === themeName) {
              return { ...theme, studiedMinutes: (theme.studiedMinutes || 0) + minutes };
            }
            return theme;
          });
          return { 
            ...s, 
            studiedMinutes: s.studiedMinutes + minutes,
            themes: updatedThemes
          };
        }
        return s;
      });
      return checkAndResetCycle(updated);
    });

    toast({
      title: "Tempo adicionado!",
      description: `+${minutes} minutos adicionados a ${subjectName}${themeName ? ` (${themeName})` : ""}`,
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast({
      title: "Sessão removida",
      description: "A sessão foi removida do histórico",
    });
  };

  const totalMinutes = subjects.reduce((acc, s) => acc + s.studiedMinutes, 0);
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ciclo de Estudos</h1>
              <p className="text-muted-foreground">Acompanhe seu progresso</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAddTimeDialogOpen(true)}
              title="Adicionar tempo manualmente"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleNotifications}
              title={notificationsEnabled ? "Desativar notificações" : "Ativar notificações"}
            >
              {notificationsEnabled ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setHistoryDialogOpen(true)}
              title="Histórico de sessões"
            >
              <History className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAchievementsDialogOpen(true)}
              title="Ver conquistas"
              className="relative"
            >
              <Award className="w-5 h-5" />
              {unlockedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-success text-success-foreground text-xs rounded-full flex items-center justify-center">
                  {unlockedCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setManageDialogOpen(true)}
              title="Gerenciar Matérias"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chart Section */}
        {subjects.length > 0 ? (
          <>
            <div className="bg-card rounded-2xl p-6 mb-8 border border-border shadow-[var(--shadow-medium)]">
              {cycleCount > 0 && (
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <RefreshCw className="w-4 h-4" />
                  <span>Ciclo {cycleCount + 1}</span>
                </div>
              )}
              <StudyCycleChart 
                subjects={subjects} 
                onOpenPomodoro={(subject) => setThemePomodoroSubject(subject)}
              />
            </div>

            {/* Weekly Goals */}
            <div className="mb-8">
              <WeeklyGoalsWidget
                goals={goals}
                onUpdateGoals={setGoals}
                currentMinutes={totalMinutes}
              />
            </div>

            {/* Subjects List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Matérias</h2>
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.name}
                  subject={subject}
                  onManageTopics={setTopicsDialogSubject}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma matéria cadastrada
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando suas matérias de estudo
            </p>
            <Button onClick={() => setManageDialogOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Gerenciar Matérias
            </Button>
          </div>
        )}
      </div>

      <ThemePomodoroDialog
        open={!!themePomodoroSubject}
        onClose={() => setThemePomodoroSubject(null)}
        subject={themePomodoroSubject}
        onStartPomodoro={handleStartPomodoroFromTheme}
      />

      <PomodoroTimer 
        subject={pomodoroSubject}
        themeName={pomodoroTheme}
        onClose={() => {
          setPomodoroSubject(null);
          setPomodoroTheme(undefined);
        }}
        onSessionComplete={handlePomodoroComplete}
      />

      <SessionCompletionDialog
        open={!!pendingSession}
        onClose={() => setPendingSession(null)}
        subjectName={pendingSession?.subjectName || ""}
        subjectColor={pendingSession?.subjectColor || ""}
        themeName={pendingSession?.themeName}
        focusMinutes={pendingSession?.focusMinutes || 0}
        breakMinutes={pendingSession?.breakMinutes || 0}
        onSave={handleSaveSession}
      />

      <StudyHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        sessions={sessions}
        onDeleteSession={handleDeleteSession}
      />

      <AddTimeDialog
        open={addTimeDialogOpen}
        onClose={() => setAddTimeDialogOpen(false)}
        subjects={subjects}
        onAddTime={handleAddManualTime}
      />

      <ManageSubjectsDialog
        open={manageDialogOpen}
        onClose={() => setManageDialogOpen(false)}
        subjects={subjects}
        onUpdateSubjects={setSubjects}
      />

      <ManageTopicsDialog
        open={!!topicsDialogSubject}
        onClose={() => setTopicsDialogSubject(null)}
        subject={topicsDialogSubject}
        onUpdateSubject={handleUpdateSubject}
      />

      <AchievementsDialog
        open={achievementsDialogOpen}
        onClose={() => setAchievementsDialogOpen(false)}
        achievements={achievements}
      />
    </div>
  );
};

export default Index;