import { Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface SubjectAdherence {
  name: string;
  adherence: number;
}

interface CurrentPlanProps {
  planName: string;
  validUntil: string;
  currentWeek: number;
  adherencePercentage: number;
  subjectAdherence?: SubjectAdherence[];
}

const CurrentPlan = ({ planName, validUntil, currentWeek, adherencePercentage, subjectAdherence }: CurrentPlanProps) => {
  const topSubjects = subjectAdherence?.slice(0, 3) ?? [];

  return (
    <div className="bg-gradient-to-br from-primary/10 to-info/10 rounded-2xl p-5 border border-primary/20 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{planName}</h3>
          <p className="text-sm text-muted-foreground">Válido até {validUntil}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
          <Award className="w-5 h-5 text-warning" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <span className="text-2xl font-bold text-primary">{currentWeek}ª</span>
          <p className="text-xs text-muted-foreground">Semana</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <span className="text-2xl font-bold text-success">{adherencePercentage}%</span>
          <p className="text-xs text-muted-foreground">Aderência</p>
        </div>
      </div>

      {topSubjects.length > 0 && (
        <div className="space-y-2 mb-4">
          {topSubjects.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="text-xs text-foreground truncate flex-1 min-w-0">{s.name}</span>
              <span className="text-[10px] text-muted-foreground w-8 text-right">{s.adherence}%</span>
              <Progress value={s.adherence} className="h-1 w-16" />
            </div>
          ))}
        </div>
      )}

      <Button variant="outline" className="w-full gap-2" size="sm" asChild>
        <Link to="/ciclo">
          Detalhes
          <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};

export default CurrentPlan;
