import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Star } from "lucide-react";
import { fireMilestoneConfetti } from "@/lib/confetti";
import { getUnlocksForLevel, CATEGORY_LABELS } from "@/lib/levelUnlocks";

interface LevelUpDialogProps {
  open: boolean;
  onClose: () => void;
  newLevel: number;
  newTitle: string;
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Recruta', 2: 'Aprendiz', 3: 'Estudante', 4: 'Novato', 5: 'Dedicado',
  6: 'Focado', 7: 'Persistente', 8: 'Guerreiro', 9: 'Veterano', 10: 'Estrategista',
  11: 'Mestre', 12: 'Grão-Mestre', 13: 'Lendário', 14: 'Épico', 15: 'Mítico',
  16: 'Imortal', 17: 'Divino', 18: 'Transcendente', 19: 'Absoluto', 20: 'Supremo',
};

const LevelUpDialog = ({ open, onClose, newLevel, newTitle }: LevelUpDialogProps) => {
  const unlocks = getUnlocksForLevel(newLevel);

  useEffect(() => {
    if (open) {
      fireMilestoneConfetti();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader className="text-center items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-warning to-primary flex items-center justify-center mb-2 mx-auto">
            <Star className="w-10 h-10 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">Nível {newLevel}!</DialogTitle>
          <DialogDescription className="text-base">
            Você agora é <span className="font-bold text-foreground">{newTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {unlocks.length > 0 && (
          <div className="space-y-3 mt-2">
            <p className="text-sm font-medium text-muted-foreground text-center">Recompensas desbloqueadas:</p>
            {unlocks.map((unlock, i) => {
              const Icon = unlock.icon;
              const catInfo = CATEGORY_LABELS[unlock.category];
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{unlock.name}</span>
                      <Badge variant="secondary" className={`text-[10px] ${catInfo.color}`}>
                        {catInfo.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{unlock.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button className="w-full mt-4 gap-2" onClick={onClose}>
          <Zap className="w-4 h-4" />
          Continuar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LevelUpDialog;
