import BottomNav from "@/components/BottomNav";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flag, Star, Trophy, Zap, Target, Swords, Crown, Medal, Rocket,
  CheckCircle2, Lock
} from "lucide-react";
import { getUnlocksForLevel, getUnlockLevels, CATEGORY_LABELS } from "@/lib/levelUnlocks";

interface Milestone {
  level: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  xpRequired: number;
}

const milestones: Milestone[] = [
  { level: 1, title: "Recruta", icon: Flag, description: "Início da jornada", xpRequired: 0 },
  { level: 2, title: "Aprendiz", icon: Star, description: "Primeiras conquistas", xpRequired: 100 },
  { level: 3, title: "Estudante", icon: Star, description: "Primeiros passos", xpRequired: 250 },
  { level: 4, title: "Novato", icon: Target, description: "Ganhando ritmo", xpRequired: 450 },
  { level: 5, title: "Dedicado", icon: Target, description: "Compromisso firmado", xpRequired: 700 },
  { level: 7, title: "Persistente", icon: Swords, description: "Superando desafios", xpRequired: 1350 },
  { level: 8, title: "Guerreiro", icon: Swords, description: "Força de vontade", xpRequired: 1750 },
  { level: 10, title: "Estrategista", icon: Trophy, description: "Dominando a arte", xpRequired: 2700 },
  { level: 12, title: "Grão-Mestre", icon: Medal, description: "Elite dos estudantes", xpRequired: 3850 },
  { level: 15, title: "Mítico", icon: Crown, description: "Lenda viva", xpRequired: 5950 },
  { level: 20, title: "Supremo", icon: Rocket, description: "Mestre absoluto", xpRequired: 10450 },
];

const JornadaPage = () => {
  const { progress } = useUserProgress();

  const getMilestoneStatus = (milestone: Milestone) => {
    if (progress.level >= milestone.level) return "completed";
    const nextMilestone = milestones.find(m => m.level > progress.level);
    if (nextMilestone && nextMilestone.level === milestone.level) return "current";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div 
        className="relative px-6 pt-12 pb-8"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--info) / 0.05) 100%)"
        }}
      >
        <h1 className="text-2xl font-bold text-foreground">Sua Jornada</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe sua evolução e recompensas
        </p>
        
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{progress.xp.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-warning/10">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Nível {progress.level}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-8">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {milestones.map((milestone, index) => {
            const status = getMilestoneStatus(milestone);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const unlocks = getUnlocksForLevel(milestone.level);
            
            return (
              <div key={milestone.level} className="relative flex gap-6 pb-8 last:pb-0">
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted 
                    ? "bg-success border-success text-success-foreground" 
                    : isCurrent
                      ? "bg-primary border-primary text-primary-foreground animate-pulse"
                      : "bg-muted border-border text-muted-foreground"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <milestone.icon className="w-5 h-5" />
                  )}
                </div>

                <Card className={`flex-1 p-4 transition-all ${
                  isCompleted 
                    ? "border-success/30 bg-success/5" 
                    : isCurrent
                      ? "border-primary/50 bg-primary/5 shadow-md"
                      : "opacity-60"
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          isCompleted 
                            ? "bg-success/20 text-success" 
                            : isCurrent
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          Nível {milestone.level}
                        </span>
                        {isCurrent && (
                          <span className="text-xs text-primary font-medium">← Você está aqui!</span>
                        )}
                      </div>
                      <h3 className={`mt-2 font-semibold ${
                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {milestone.xpRequired.toLocaleString()} XP
                    </p>
                  </div>

                  {/* Unlocks for this level */}
                  {unlocks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      {unlocks.map((unlock, i) => {
                        const UnlockIcon = unlock.icon;
                        const catInfo = CATEGORY_LABELS[unlock.category];
                        const isUnlocked = progress.level >= milestone.level;
                        return (
                          <div key={i} className={`flex items-center gap-2 text-xs ${isUnlocked ? "" : "opacity-60"}`}>
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${
                              isUnlocked ? "bg-success/10" : "bg-muted"
                            }`}>
                              {isUnlocked ? (
                                <UnlockIcon className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Lock className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                            <span className={isUnlocked ? "text-foreground" : "text-muted-foreground"}>
                              {unlock.name}
                            </span>
                            <Badge variant="outline" className={`text-[9px] ml-auto ${catInfo.color}`}>
                              {catInfo.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progresso para próximo nível</span>
                        <span>{Math.round(((progress.xp - milestone.xpRequired) / (milestones[index + 1]?.xpRequired - milestone.xpRequired || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${Math.min(((progress.xp - milestone.xpRequired) / (milestones[index + 1]?.xpRequired - milestone.xpRequired || 1)) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default JornadaPage;
