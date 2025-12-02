import { useState, useEffect } from "react";
import { BookOpen, Settings, Award, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudyCycleChart from "@/components/StudyCycleChart";
import SubjectCard from "@/components/SubjectCard";
import PomodoroTimer from "@/components/PomodoroTimer";
import ManageSubjectsDialog from "@/components/ManageSubjectsDialog";
import ManageTopicsDialog from "@/components/ManageTopicsDialog";
import WeeklyGoalsWidget from "@/components/WeeklyGoalsWidget";
import AchievementsDialog from "@/components/AchievementsDialog";
import { Subject, WeeklyGoal, Achievement } from "@/types/study";
import { ACHIEVEMENTS, checkAchievements } from "@/lib/achievements";
import { useToast } from "@/hooks/use-toast";

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

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved === "true";
  });

  const [pomodoroSubject, setPomodoroSubject] = useState<Subject | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [topicsDialogSubject, setTopicsDialogSubject] = useState<Subject | null>(null);
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);

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
              <StudyCycleChart 
                subjects={subjects} 
                onOpenPomodoro={(subject) => setPomodoroSubject(subject)}
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

      <PomodoroTimer 
        subject={pomodoroSubject}
        onClose={() => setPomodoroSubject(null)}
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
