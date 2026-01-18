import BottomNav from "@/components/BottomNav";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Card } from "@/components/ui/card";
import { 
  Flag, 
  Star, 
  Trophy, 
  Zap, 
  Target,
  Swords,
  Crown,
  Medal,
  Rocket,
  CheckCircle2
} from "lucide-react";

interface Milestone {
  level: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  xpRequired: number;
}

const milestones: Milestone[] = [
  { level: 1, title: "Recruta", icon: Flag, description: "Início da jornada", xpRequired: 0 },
  { level: 3, title: "Estudante", icon: Star, description: "Primeiros passos", xpRequired: 250 },
  { level: 5, title: "Dedicado", icon: Target, description: "Compromisso firmado", xpRequired: 700 },
  { level: 7, title: "Persistente", icon: Swords, description: "Superando desafios", xpRequired: 1350 },
  { level: 10, title: "Estrategista", icon: Trophy, description: "Dominando a arte", xpRequired: 2700 },
  { level: 12, title: "Grão-Mestre", icon: Medal, description: "Elite dos estudantes", xpRequired: 3850 },
  { level: 15, title: "Mítico", icon: Crown, description: "Lenda viva", xpRequired: 5950 },
  { level: 18, title: "Transcendente", icon: Rocket, description: "Além dos limites", xpRequired: 8500 },
  { level: 20, title: "Supremo", icon: Zap, description: "Mestre absoluto", xpRequired: 10450 },
];

const JornadaPage = () => {
  const { progress } = useUserProgress();

  const getMilestoneStatus = (milestone: Milestone) => {
    if (progress.level >= milestone.level) return "completed";
    if (progress.level === milestone.level - 1 || progress.level === milestone.level - 2) return "current";
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
          Acompanhe sua evolução de Recruta a Supremo
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
          {/* Linha vertical */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {milestones.map((milestone, index) => {
            const status = getMilestoneStatus(milestone);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            
            return (
              <div key={milestone.level} className="relative flex gap-6 pb-8 last:pb-0">
                {/* Ícone do marco */}
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

                {/* Conteúdo */}
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
                          <span className="text-xs text-primary font-medium">
                            ← Você está aqui!
                          </span>
                        )}
                      </div>
                      <h3 className={`mt-2 font-semibold ${
                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {milestone.xpRequired.toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                  
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
