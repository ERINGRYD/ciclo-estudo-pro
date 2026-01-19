import { Zap, Check, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useDailyMissions, DailyMission } from "@/hooks/useDailyMissions";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useToast } from "@/hooks/use-toast";

interface DailyMissionsProps {
  userLevel?: number;
}

const DailyMissions = ({ userLevel = 1 }: DailyMissionsProps) => {
  const { missions, expiresIn, claimMissionReward, getIconComponent } = useDailyMissions(userLevel);
  const { addXP } = useUserProgress();
  const { toast } = useToast();

  const handleClaimReward = (mission: DailyMission) => {
    const xpReward = claimMissionReward(mission.id);
    if (xpReward > 0) {
      addXP(xpReward);
      toast({
        title: "Recompensa Coletada! 🎉",
        description: `Você ganhou ${xpReward} XP!`,
      });
    }
  };

  if (missions.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Missões Diárias</h2>
        <span className="text-xs text-muted-foreground">Expira em {expiresIn}</span>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const IconComponent = getIconComponent(mission.icon);
          const isCompleted = mission.completed;
          const isClaimed = mission.claimed;

          return (
            <div
              key={mission.id}
              className={`bg-card rounded-xl p-4 border transition-all ${
                isClaimed 
                  ? "border-success/30 bg-success/5" 
                  : isCompleted 
                    ? "border-warning/50 bg-warning/5" 
                    : "border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${mission.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {isClaimed ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <IconComponent className={`w-5 h-5 ${mission.iconColor}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${isClaimed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {mission.title}
                    </h3>
                    {!isClaimed && (
                      <div className="flex items-center gap-1 bg-warning/10 px-2 py-0.5 rounded-full">
                        <Zap className="w-3 h-3 text-warning" />
                        <span className="text-xs font-medium text-warning">{mission.xp} XP</span>
                      </div>
                    )}
                    {isClaimed && (
                      <span className="text-xs text-success font-medium">Coletado ✓</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                  
                  {!isClaimed && (
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(mission.current / mission.target) * 100} 
                        className="h-2 flex-1"
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {mission.current}/{mission.target}
                      </span>
                    </div>
                  )}

                  {isCompleted && !isClaimed && (
                    <Button
                      size="sm"
                      className="mt-2 w-full gap-2"
                      onClick={() => handleClaimReward(mission)}
                    >
                      <Gift className="w-4 h-4" />
                      Coletar Recompensa
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyMissions;
