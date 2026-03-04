import { Lock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getNextUnlocks, CATEGORY_LABELS } from "@/lib/levelUnlocks";
import { useNavigate } from "react-router-dom";

interface NextRewardCardProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  levelProgress: number;
}

const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
  3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
];

const NextRewardCard = ({ currentLevel, currentXP, xpForNextLevel, levelProgress }: NextRewardCardProps) => {
  const navigate = useNavigate();
  const nextData = getNextUnlocks(currentLevel);

  if (!nextData) return null;

  const { level: nextLevel, unlocks } = nextData;
  const targetXP = LEVEL_THRESHOLDS[nextLevel - 1] || 0;
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const progressToReward = targetXP > currentLevelXP
    ? Math.min(((currentXP - currentLevelXP) / (targetXP - currentLevelXP)) * 100, 100)
    : 0;

  const firstUnlock = unlocks[0];
  const Icon = firstUnlock.icon;
  const catInfo = CATEGORY_LABELS[firstUnlock.category];

  return (
    <Card 
      className="mb-4 p-4 cursor-pointer hover:shadow-md transition-all border-primary/20"
      onClick={() => navigate("/jornada")}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 relative">
          <Icon className="w-6 h-6 text-primary" />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Próxima Recompensa</span>
              <Badge variant="outline" className={`text-[10px] ${catInfo.color}`}>
                Nv.{nextLevel}
              </Badge>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mb-2 truncate">
            {firstUnlock.name}{unlocks.length > 1 ? ` +${unlocks.length - 1} mais` : ""}
          </p>
          <div className="flex items-center gap-2">
            <Progress value={progressToReward} className="h-1.5 flex-1" />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {Math.max(0, targetXP - currentXP)} XP restante
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NextRewardCard;
