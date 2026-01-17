import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Skull, Clock, Target, Zap, Calendar, Swords } from "lucide-react";
import { BattleHistory } from "@/types/question";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BattleHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: BattleHistory[];
}

const BattleHistoryDialog = ({ open, onOpenChange, history }: BattleHistoryDialogProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalWins = history.filter(b => b.isVictory).length;
  const totalBattles = history.length;
  const winRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;
  const totalXP = history.reduce((sum, b) => sum + b.xpEarned, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary" />
            Histórico de Batalhas
          </DialogTitle>
        </DialogHeader>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{totalWins}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Vitórias</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-3 text-center">
            <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{winRate}%</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Taxa de Vitória</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-3 text-center">
            <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{totalXP}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">XP Total</p>
          </div>
        </div>

        {/* Battle List */}
        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhuma batalha registrada</p>
              <p className="text-sm">Complete batalhas no Coliseu!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((battle) => (
                <div
                  key={battle.id}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    battle.isVictory
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {battle.isVictory ? (
                        <Trophy className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Skull className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-bold text-foreground">{battle.subject}</p>
                        <p className="text-xs text-muted-foreground">{battle.mode}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                      battle.isVictory
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                    }`}>
                      {battle.isVictory ? 'VITÓRIA' : 'DERROTA'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Target className="w-3.5 h-3.5" />
                        {battle.correctAnswers}/{battle.totalQuestions}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(battle.totalTime)}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" />
                        +{battle.xpEarned}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(battle.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BattleHistoryDialog;
