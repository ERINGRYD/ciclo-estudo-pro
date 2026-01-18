import BottomNav from "@/components/BottomNav";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Trophy, 
  Target, 
  Zap, 
  Swords, 
  Medal, 
  TrendingUp,
  Star,
  Crown
} from "lucide-react";

const PerfilPage = () => {
  const { progress, battleHistory, levelProgress, xpForNextLevel } = useUserProgress();

  const winRate = progress.totalBattles > 0 
    ? Math.round((progress.totalBattleWins / progress.totalBattles) * 100) 
    : 0;

  const accuracyRate = progress.totalQuestionsAnswered > 0 
    ? Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100) 
    : 0;

  const stats = [
    { 
      icon: Zap, 
      label: "XP Total", 
      value: progress.xp.toLocaleString(),
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      icon: Target, 
      label: "Questões", 
      value: progress.totalQuestionsAnswered.toLocaleString(),
      color: "text-info",
      bgColor: "bg-info/10"
    },
    { 
      icon: Swords, 
      label: "Batalhas", 
      value: progress.totalBattles.toLocaleString(),
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    { 
      icon: Trophy, 
      label: "Vitórias", 
      value: progress.totalBattleWins.toLocaleString(),
      color: "text-success",
      bgColor: "bg-success/10"
    },
  ];

  const achievements = [
    { 
      icon: Star, 
      title: "Primeira Batalha", 
      unlocked: progress.totalBattles >= 1,
      description: "Complete sua primeira batalha"
    },
    { 
      icon: Medal, 
      title: "10 Vitórias", 
      unlocked: progress.totalBattleWins >= 10,
      description: "Vença 10 batalhas"
    },
    { 
      icon: Crown, 
      title: "Nível 5", 
      unlocked: progress.level >= 5,
      description: "Alcance o nível 5"
    },
    { 
      icon: TrendingUp, 
      title: "100 Questões", 
      unlocked: progress.totalQuestionsAnswered >= 100,
      description: "Responda 100 questões"
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header com gradiente */}
      <div 
        className="relative h-48 flex items-end justify-center pb-16"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--info)) 100%)"
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 20%, hsl(0 0% 100% / 0.3) 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, hsl(0 0% 100% / 0.2) 0%, transparent 40%)
              `,
            }}
          />
        </div>
      </div>

      {/* Avatar */}
      <div className="relative -mt-16 flex flex-col items-center px-6">
        <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
            US
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-4 text-2xl font-bold text-foreground">Usuário</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Nível {progress.level}
          </span>
          <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
            {progress.title}
          </span>
        </div>

        {/* Barra de XP */}
        <div className="w-full max-w-sm mt-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{progress.xp.toLocaleString()} XP</span>
            <span>{xpForNextLevel.toLocaleString()} XP</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-center text-xs text-muted-foreground mt-2">
            Faltam {(xpForNextLevel - progress.xp).toLocaleString()} XP para o próximo nível
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Estatísticas</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Taxa de acerto e vitória */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
            <p className="text-3xl font-bold text-success mt-1">{accuracyRate}%</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Taxa de Vitória</p>
            <p className="text-3xl font-bold text-primary mt-1">{winRate}%</p>
          </Card>
        </div>
      </div>

      {/* Conquistas */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Conquistas</h2>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.title} 
              className={`p-4 text-center transition-all ${
                achievement.unlocked 
                  ? "border-primary/30 bg-primary/5" 
                  : "opacity-50 grayscale"
              }`}
            >
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                achievement.unlocked ? "bg-primary/20" : "bg-muted"
              }`}>
                <achievement.icon className={`w-6 h-6 ${
                  achievement.unlocked ? "text-primary" : "text-muted-foreground"
                }`} />
              </div>
              <p className="mt-2 font-medium text-sm text-foreground">{achievement.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PerfilPage;
