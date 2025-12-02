import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Achievement } from "@/types/study";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface AchievementsDialogProps {
  open: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const AchievementsDialog = ({ open, onClose, achievements }: AchievementsDialogProps) => {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Conquistas {unlockedCount}/{totalCount}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {achievements.map((achievement) => {
            const isUnlocked = !!achievement.unlockedAt;
            
            return (
              <Card
                key={achievement.id}
                className={`p-4 transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-br from-primary/5 to-success/5 border-primary/20"
                    : "bg-muted/30 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`text-4xl ${
                      !isUnlocked && "grayscale opacity-50"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {achievement.name}
                          {!isUnlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      </div>
                      {isUnlocked && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                          Desbloqueada
                        </Badge>
                      )}
                    </div>
                    {isUnlocked && achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground">
                        Conquistada em {formatDate(achievement.unlockedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {unlockedCount === totalCount && (
          <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-success/10 rounded-lg border border-primary/20">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="font-bold text-xl text-foreground mb-2">
              Parabéns!
            </h3>
            <p className="text-muted-foreground">
              Você desbloqueou todas as conquistas disponíveis!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsDialog;
