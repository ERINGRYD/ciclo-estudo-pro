import { Link } from "react-router-dom";
import { AlertTriangle, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeakPoint {
  subject: string;
  hitRate: number;
  totalQuestions: number;
}

interface WeakPointsCardProps {
  weakPoints: WeakPoint[];
}

const WeakPointsCard = ({ weakPoints }: WeakPointsCardProps) => {
  if (weakPoints.length === 0) return null;

  const getBarColor = (rate: number) => {
    if (rate < 40) return "bg-destructive";
    if (rate < 60) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <h2 className="text-sm font-medium text-muted-foreground">Pontos Fracos</h2>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        {weakPoints.map((wp) => (
          <div key={wp.subject} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate">{wp.subject}</span>
                <span className={`text-xs font-semibold ${wp.hitRate < 50 ? "text-destructive" : "text-warning"}`}>
                  {wp.hitRate}%
                </span>
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
        ))}
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
