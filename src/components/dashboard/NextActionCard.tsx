import { Link } from "react-router-dom";
import { Play, Bookmark, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NextActionCardProps {
  subjectName: string;
  subjectArea: string;
  cycleNumber: number;
}

const NextActionCard = ({ subjectName, subjectArea, cycleNumber }: NextActionCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <span className="text-sm font-medium text-muted-foreground">
          Próxima Ação
        </span>
      </div>
      
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bookmark className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{subjectName}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>{subjectArea} • Ciclo {cycleNumber}</span>
          </div>
        </div>
      </div>

      <Button asChild className="w-full gap-2" size="lg">
        <Link to="/ciclo">
          <Play className="w-4 h-4" />
          Continuar Estudos
        </Link>
      </Button>
    </div>
  );
};

export default NextActionCard;
