import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trophy, Target, Clock, Zap, CheckCircle2, XCircle, Home, RotateCcw } from "lucide-react";
import { BattleResult } from "@/types/question";
import { Button } from "./ui/button";

interface BattleResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: BattleResult;
  onRetry: () => void;
  onGoHome: () => void;
}

const BattleResultDialog = ({ open, onOpenChange, result, onRetry, onGoHome }: BattleResultDialogProps) => {
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const avgTimePerQuestion = Math.round(result.totalTime / result.totalQuestions);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return { text: "Excelente!", color: "text-emerald-500", bg: "bg-emerald-500" };
    if (accuracy >= 60) return { text: "Bom trabalho!", color: "text-blue-500", bg: "bg-blue-500" };
    if (accuracy >= 40) return { text: "Continue praticando!", color: "text-amber-500", bg: "bg-amber-500" };
    return { text: "Não desista!", color: "text-red-500", bg: "bg-red-500" };
  };

  const performance = getPerformanceMessage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full max-h-[90vh] p-0 gap-0 border-0 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className={`${performance.bg} p-8 text-center text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black mb-1">Batalha Concluída!</h2>
            <p className="text-lg font-bold opacity-90">{performance.text}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 bg-background">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Accuracy */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Precisão</span>
              </div>
              <p className="text-3xl font-black text-foreground">{accuracy}%</p>
            </div>

            {/* XP Earned */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">XP Ganho</span>
              </div>
              <p className="text-3xl font-black text-foreground">{result.totalXP}</p>
            </div>

            {/* Correct/Total */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Acertos</span>
              </div>
              <p className="text-3xl font-black text-foreground">
                {result.correctAnswers}<span className="text-lg text-muted-foreground">/{result.totalQuestions}</span>
              </p>
            </div>

            {/* Time */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Tempo</span>
              </div>
              <p className="text-2xl font-black text-foreground">{formatTime(result.totalTime)}</p>
            </div>
          </div>

          {/* Question Summary */}
          <div className="bg-card rounded-2xl p-4 border border-border mb-6">
            <h3 className="text-sm font-bold text-foreground mb-3">Resumo das Questões</h3>
            <div className="flex flex-wrap gap-2">
              {result.results.map((r, index) => (
                <div
                  key={r.questionId}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    r.isCorrect
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {r.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-xl font-bold"
              onClick={onGoHome}
            >
              <Home className="w-5 h-5 mr-2" />
              Início
            </Button>
            <Button
              className="flex-1 h-14 rounded-xl font-bold bg-primary hover:bg-primary/90"
              onClick={onRetry}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jogar Novamente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BattleResultDialog;
