import BottomNav from "@/components/BottomNav";
import QuestionBattleDialog from "@/components/QuestionBattleDialog";
import { Search, Flame, Users, AlertTriangle, CheckCircle, Zap, Shield, Trophy, Crown, Swords, TrendingUp, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useNavigate } from "react-router-dom";

type TabType = "frente" | "batalhas" | "vencidos";

// Derived from battle history — group by subject
interface SubjectStats {
  subject: string;
  totalBattles: number;
  totalQuestions: number;
  correctAnswers: number;
  totalXP: number;
  winRate: number;
  lastBattleDate: string | null;
  isDefeated: boolean; // >= 80% win rate with 3+ battles
  isCritical: boolean; // win rate < 50%
}

const subjectColors: Record<string, string> = {
  "Matemática": "text-blue-500",
  "Português": "text-green-500",
  "História": "text-amber-500",
  "Física": "text-pink-500",
  "Química": "text-purple-500",
  "Biologia": "text-emerald-500",
  "Todas as Matérias": "text-primary",
};

const subjectBgColors: Record<string, string> = {
  "Matemática": "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
  "Português": "bg-green-50 dark:bg-green-900/20 text-green-500",
  "História": "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
  "Física": "bg-pink-50 dark:bg-pink-900/20 text-pink-500",
  "Química": "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
  "Biologia": "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500",
  "Todas as Matérias": "bg-primary/10 text-primary",
};

function getSubjectIcon(subject: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    "Matemática": <span className="text-2xl font-black">∑</span>,
    "Português": <span className="text-2xl font-black">Aa</span>,
    "História": <span className="text-2xl font-black">📜</span>,
    "Física": <span className="text-2xl font-black">⚡</span>,
    "Química": <span className="text-2xl font-black">⚗</span>,
    "Biologia": <span className="text-2xl font-black">🧬</span>,
  };
  return icons[subject] ?? <Swords className="w-6 h-6" />;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

const BatalhaPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("frente");
  const [searchQuery, setSearchQuery] = useState("");
  const [battleDialogOpen, setBattleDialogOpen] = useState(false);
  const [currentBattle, setCurrentBattle] = useState<{ name: string; subject: string }>({ name: "", subject: "" });
  const navigate = useNavigate();

  const { battleHistory, progress } = useUserProgress();

  // Compute per-subject stats from real battle history
  const subjectStats = useMemo<SubjectStats[]>(() => {
    const map = new Map<string, {
      battles: number; questions: number; correct: number; xp: number; wins: number; lastDate: string | null;
    }>();

    for (const battle of battleHistory) {
      const key = battle.subject === "Todas as Matérias" || battle.subject === "Todas" ? "Todas as Matérias" : battle.subject;
      const existing = map.get(key) ?? { battles: 0, questions: 0, correct: 0, xp: 0, wins: 0, lastDate: null };
      map.set(key, {
        battles: existing.battles + 1,
        questions: existing.questions + battle.totalQuestions,
        correct: existing.correct + battle.correctAnswers,
        xp: existing.xp + battle.xpEarned,
        wins: existing.wins + (battle.isVictory ? 1 : 0),
        lastDate: existing.lastDate
          ? (new Date(battle.date) > new Date(existing.lastDate) ? battle.date : existing.lastDate)
          : battle.date,
      });
    }

    return Array.from(map.entries()).map(([subject, s]) => {
      const winRate = s.battles > 0 ? s.wins / s.battles : 0;
      return {
        subject,
        totalBattles: s.battles,
        totalQuestions: s.questions,
        correctAnswers: s.correct,
        totalXP: s.xp,
        winRate,
        lastBattleDate: s.lastDate,
        isDefeated: winRate >= 0.8 && s.battles >= 3,
        isCritical: winRate < 0.5 && s.battles > 0,
      };
    });
  }, [battleHistory]);

  const handleStartBattle = (enemyName: string, subject: string) => {
    setCurrentBattle({ name: enemyName, subject });
    setBattleDialogOpen(true);
  };

  const frontline = subjectStats.filter(s => !s.isDefeated).filter(s =>
    s.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const defeated = subjectStats.filter(s => s.isDefeated).filter(s =>
    s.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const allBattles = [...subjectStats].sort((a, b) => (b.totalBattles - a.totalBattles));

  const criticalCount = subjectStats.filter(s => s.isCritical && !s.isDefeated).length;
  const dominatedCount = subjectStats.filter(s => s.isDefeated).length;
  const totalEnemies = subjectStats.filter(s => !s.isDefeated).length;

  const EnemyCard = ({ stat, large = false }: { stat: SubjectStats; large?: boolean }) => {
    const barColor = stat.isDefeated ? "bg-green-500" : stat.isCritical ? "bg-destructive" : "bg-primary";
    const barWidth = stat.totalQuestions > 0 ? Math.round((stat.correctAnswers / stat.totalQuestions) * 100) : 0;
    const borderClass = stat.isCritical
      ? "border-destructive/40 shadow-destructive/5"
      : stat.isDefeated
        ? "border-green-200 dark:border-green-900/40"
        : "border-border";
    const bgClass = subjectBgColors[stat.subject] ?? "bg-primary/10 text-primary";
    const textClass = subjectColors[stat.subject] ?? "text-primary";

    return (
      <div className={`relative bg-card rounded-3xl border shadow-md p-5 flex flex-col ${borderClass}`}>
        {/* Status icon */}
        <div className="absolute top-5 right-5 z-10">
          {stat.isDefeated
            ? <CheckCircle className="w-5 h-5 text-green-500" />
            : stat.isCritical
              ? <AlertTriangle className="w-5 h-5 text-destructive" />
              : <Shield className="w-5 h-5 text-muted-foreground" />}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center w-full mb-4 pt-2">
          <div className={`${large ? "w-16 h-16" : "w-14 h-14"} rounded-full flex items-center justify-center mb-3 ${bgClass}`}>
            {getSubjectIcon(stat.subject)}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${textClass}`}>{stat.subject}</span>
          <p className="text-[10px] text-muted-foreground font-medium">
            {stat.totalBattles} batalha{stat.totalBattles !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Accuracy bar */}
        <div className="w-full h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${barWidth}%` }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 w-full mb-5 divide-x divide-border">
          <div className="text-center px-1">
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Questões</span>
            <span className="block text-sm font-bold text-foreground">{stat.totalQuestions}</span>
          </div>
          <div className="text-center px-1">
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Acertos</span>
            <span className={`block text-sm font-bold ${stat.isCritical ? "text-destructive" : stat.isDefeated ? "text-green-500" : "text-foreground"}`}>
              {stat.correctAnswers}/{stat.totalQuestions}
            </span>
          </div>
          <div className="text-center px-1">
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">XP</span>
            <span className="block text-sm font-bold text-foreground">{stat.totalXP}</span>
          </div>
        </div>

        {/* Last battle */}
        {stat.lastBattleDate && (
          <div className="flex items-center justify-between text-xs mb-5 px-1">
            <span className="text-muted-foreground font-medium">Última batalha:</span>
            <span className="font-bold text-foreground">{formatDate(stat.lastBattleDate)}</span>
          </div>
        )}

        {/* CTA */}
        {stat.isDefeated ? (
          <button
            onClick={() => handleStartBattle(stat.subject, stat.subject)}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3 rounded-2xl shadow-sm shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Trophy className="w-4 h-4" />
            Revisar Novamente
          </button>
        ) : stat.isCritical ? (
          <button
            onClick={() => handleStartBattle(stat.subject, stat.subject)}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Shield className="w-4 h-4" />
            Defender Agora
          </button>
        ) : (
          <button
            onClick={() => handleStartBattle(stat.subject, stat.subject)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Swords className="w-4 h-4" />
            Iniciar Batalha
          </button>
        )}
      </div>
    );
  };

  // Empty state if no battles yet
  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Swords className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{message}</p>
      <button
        onClick={() => navigate("/coliseu")}
        className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl"
      >
        Ir ao Coliseu
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="bg-card/80 border-b border-border pt-6 pb-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="px-4 max-w-md mx-auto">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-destructive to-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-destructive/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none text-foreground mb-1">Campo de Batalha</h1>
                <p className="text-xs text-muted-foreground">Enfrente seus inimigos e conquiste</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-warning/10 px-2 py-1 rounded-lg border border-warning/20">
              <Flame className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-bold text-warning">Nv.{progress.level}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
              <Users className="w-5 h-5 text-info mb-1" />
              <span className="text-lg font-bold text-foreground leading-none">{totalEnemies}</span>
              <span className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">Inimigos</span>
            </div>
            <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              {criticalCount > 0 && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-destructive m-2 animate-pulse" />}
              <AlertTriangle className="w-5 h-5 text-destructive mb-1" />
              <span className="text-lg font-bold text-foreground leading-none">{criticalCount}</span>
              <span className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">Críticos</span>
            </div>
            <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
              <CheckCircle className="w-5 h-5 text-success mb-1" />
              <span className="text-lg font-bold text-foreground leading-none">{dominatedCount}</span>
              <span className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">Dominados</span>
            </div>
          </div>

          {/* Overall accuracy bar */}
          {battleHistory.length > 0 && (() => {
            const totalQ = battleHistory.reduce((s, b) => s + b.totalQuestions, 0);
            const totalC = battleHistory.reduce((s, b) => s + b.correctAnswers, 0);
            const acc = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
            const winPct = Math.round((progress.totalBattleWins / Math.max(progress.totalBattles, 1)) * 100);
            return (
              <div className="bg-card rounded-xl p-3 border border-border shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${acc}%` }} />
                  </div>
                  <span className="text-xs font-bold text-success w-8 text-right">{acc}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-warning flex-shrink-0" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: `${winPct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-warning w-8 text-right">{winPct}%</span>
                </div>
              </div>
            );
          })()}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 max-w-md mx-auto space-y-5">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            placeholder="Buscar matérias..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="bg-muted p-1 rounded-2xl grid grid-cols-3 gap-1">
          {(["frente", "batalhas", "vencidos"] as TabType[]).map((tab) => {
            const labels: Record<TabType, string> = { frente: "Linha de Frente", batalhas: "Histórico", vencidos: "Vencidos" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === tab
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {tab === "frente" && <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                {tab === "vencidos" && <Trophy className="w-3.5 h-3.5" />}
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab: Linha de Frente */}
        {activeTab === "frente" && (
          <section className="space-y-4">
            {frontline.length === 0 ? (
              <EmptyState message="Nenhuma matéria em batalha ainda. Comece um combate no Coliseu!" />
            ) : (
              frontline.map((stat, i) => <EnemyCard key={stat.subject} stat={stat} large={i === 0} />)
            )}
          </section>
        )}

        {/* Tab: Histórico */}
        {activeTab === "batalhas" && (
          <section className="space-y-3">
            {battleHistory.length === 0 ? (
              <EmptyState message="Nenhuma batalha registrada ainda." />
            ) : (
              battleHistory.slice(0, 30).map((battle) => (
                <div key={battle.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${battle.isVictory ? "bg-success/10" : "bg-destructive/10"}`}>
                    {battle.isVictory ? <CheckCircle className="w-5 h-5 text-success" /> : <Shield className="w-5 h-5 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{battle.subject}</p>
                    <p className="text-xs text-muted-foreground">{battle.mode} • {formatDate(battle.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">{battle.correctAnswers}/{battle.totalQuestions}</p>
                    <p className="text-xs font-semibold text-warning">+{battle.xpEarned} XP</p>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* Tab: Vencidos */}
        {activeTab === "vencidos" && (
          <section className="space-y-4">
            {defeated.length === 0 ? (
              <EmptyState message="Nenhuma matéria dominada ainda. Alcance 80% de vitórias em 3+ batalhas!" />
            ) : (
              defeated.map((stat) => <EnemyCard key={stat.subject} stat={stat} />)
            )}
          </section>
        )}

        {/* Chefes de Matéria */}
        {activeTab === "frente" && allBattles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Crown className="w-4 h-4 text-warning" />
                Chefes de Matéria
              </h2>
            </div>
            <div className="space-y-2">
              {allBattles.slice(0, 5).map((stat) => {
                const acc = stat.totalQuestions > 0 ? Math.round((stat.correctAnswers / stat.totalQuestions) * 100) : 0;
                const barColor = acc >= 80 ? "bg-success" : acc >= 50 ? "bg-warning" : "bg-destructive";
                return (
                  <div key={stat.subject} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${subjectBgColors[stat.subject] ?? "bg-primary/10 text-primary"}`}>
                      {getSubjectIcon(stat.subject)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-foreground truncate">{stat.subject}</span>
                        <span className="text-xs font-black text-foreground ml-2">{acc}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${acc}%` }} />
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <span className="text-[10px] font-bold text-muted-foreground">{stat.totalBattles}x</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNav />

      <QuestionBattleDialog
        open={battleDialogOpen}
        onOpenChange={setBattleDialogOpen}
        enemyName={currentBattle.name}
        subject={currentBattle.subject}
        questionCount={10}
        mode="Batalha Personalizada"
      />
    </div>
  );
};

export default BatalhaPage;
