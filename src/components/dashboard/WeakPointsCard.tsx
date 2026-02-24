import { Link } from "react-router-dom";
import { AlertTriangle, Swords, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeakPoint {
  subject: string;
  hitRate: number;
  totalQuestions: number;
}

export type WeakPointTrend = "improving" | "declining" | "stable";

interface WeakPointsCardProps {
  weakPoints: WeakPoint[];
  trends?: Record<string, WeakPointTrend>;
}

const WeakPointsCard = ({ weakPoints, trends }: WeakPointsCardProps) => {
  const getBarColor = (rate: number) => {
    if (rate < 40) return "bg-destructive";
    if (rate < 60) return "bg-warning";
    return "bg-success";
  };

  if (weakPoints.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h2 className="text-sm font-medium text-muted-foreground">Pontos Fracos</h2>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border text-center">
          <Swords className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-1">Nenhum ponto fraco identificado</p>
          <p className="text-xs text-muted-foreground/70 mb-3">
            Resolva questões no Coliseu para descobrir seus pontos fracos
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/coliseu">Ir para o Coliseu</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <h2 className="text-sm font-medium text-muted-foreground">Pontos Fracos</h2>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        {weakPoints.map((wp) => {
          const trend = trends?.[wp.subject];
          return (
            <div key={wp.subject} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{wp.subject}</span>
                  <div className="flex items-center gap-1">
                    {trend === "improving" && <TrendingUp className="w-3 h-3 text-success" />}
                    {trend === "declining" && <TrendingDown className="w-3 h-3 text-destructive" />}
                    <span className={`text-xs font-semibold ${wp.hitRate < 50 ? "text-destructive" : "text-warning"}`}>
                      {wp.hitRate}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getBarColor(wp.hitRate)}`}
                    style={{ width: `${wp.hitRate}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{wp.totalQuestions} questões respondidas</p>
              </div>
            </div>
          );
        })}
        <Button variant="outline" size="sm" className="w-full gap-2 mt-2" asChild>
          <Link to="/coliseu">
            <Swords className="w-4 h-4" />
            Praticar Pontos Fracos
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default WeakPointsCard;
