import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, Flame, Trophy } from "lucide-react";
import { useMissionStreak } from "@/hooks/useMissionStreak";

const MissionStreakAchievements = () => {
  const { streakData, getStreakAchievements } = useMissionStreak();
  const achievements = getStreakAchievements();

  return (
    <div className="space-y-4">
      {/* Current Streak Display */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-warning/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Flame className="w-7 h-7 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sequência Atual</p>
              <p className="text-2xl font-bold text-foreground">{streakData.currentStreak} dias</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Recorde</span>
            </div>
            <p className="text-lg font-semibold text-primary">{streakData.longestStreak} dias</p>
          </div>
        </div>
      </Card>

      {/* Streak Achievements */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Conquistas de Sequência</h3>
        
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 transition-all ${
              achievement.unlocked
                ? "bg-gradient-to-br from-success/5 to-primary/5 border-success/20"
                : "bg-muted/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`text-3xl ${
                  !achievement.unlocked && "grayscale opacity-50"
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {achievement.name}
                      {!achievement.unlocked && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 shrink-0">
                      Conquistado
                    </Badge>
                  )}
                </div>
                
                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <Progress value={achievement.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {achievement.currentProgress}/{achievement.days} dias
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MissionStreakAchievements;
