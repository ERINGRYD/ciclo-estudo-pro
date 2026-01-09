import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Swords, Trophy, Clock, Award, TrendingUp, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { Subject, StudySession, Achievement } from "@/types/study";
import { ACHIEVEMENTS } from "@/lib/achievements";

const STORAGE_KEY = "study-cycle-subjects";
const SESSIONS_STORAGE_KEY = "study-cycle-sessions";
const ACHIEVEMENTS_STORAGE_KEY = "study-cycle-achievements";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const savedSubjects = localStorage.getItem(STORAGE_KEY);
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch {}
    }

    const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch {}
    }

    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch {
        setAchievements(ACHIEVEMENTS);
      }
    } else {
      setAchievements(ACHIEVEMENTS);
    }
  }, []);

  const totalStudiedMinutes = subjects.reduce((acc, s) => acc + s.studiedMinutes, 0);
  const totalHours = Math.floor(totalStudiedMinutes / 60);
  const totalMins = totalStudiedMinutes % 60;
  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.date).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.focusMinutes, 0);

  const quickActions = [
    {
      to: "/ciclo",
      icon: PieChart,
      label: "Ciclo de Estudos",
      description: "Gerencie suas matérias",
      color: "bg-primary/10 text-primary",
    },
    {
      to: "/batalha",
      icon: Swords,
      label: "Batalha",
      description: "Desafie-se",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      to: "/coliseu",
      icon: Trophy,
      label: "Coliseu",
      description: "Compete e ganhe",
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Olá, Estudante!</h1>
            <p className="text-muted-foreground">Vamos estudar hoje?</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Tempo Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalHours}h {totalMins}m
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm text-muted-foreground">Hoje</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{todayMinutes} min</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-sm text-muted-foreground">Matérias</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{subjects.length}</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-sm text-muted-foreground">Conquistas</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {unlockedAchievements}/{achievements.length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
        <div className="space-y-3 mb-8">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:bg-accent/50 transition-colors">
                <div className={`p-3 rounded-xl ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Sessions */}
        {todaySessions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-foreground mb-4">Sessões de Hoje</h2>
            <div className="space-y-3">
              {todaySessions.slice(-3).reverse().map((session) => (
                <div
                  key={session.id}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: session.subjectColor }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{session.subjectName}</p>
                    {session.themeName && (
                      <p className="text-sm text-muted-foreground">{session.themeName}</p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {session.focusMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Comece sua jornada!
            </h3>
            <p className="text-muted-foreground mb-6">
              Configure suas matérias no Ciclo de Estudos
            </p>
            <Button asChild>
              <Link to="/ciclo">
                <PieChart className="w-4 h-4 mr-2" />
                Ir para Ciclo
              </Link>
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
