import { Link } from "react-router-dom";
import { BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const LockedMetrics = () => {
  return (
    <div className="mb-24">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Progresso por Matéria</h2>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border relative overflow-hidden">
        {/* Blurred content behind */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 opacity-20 blur-sm p-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </div>

        {/* Lock overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Métricas Bloqueadas</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Avance nos seus estudos e complete o primeiro módulo para desbloquear sua análise de desempenho detalhada.
          </p>
          <Button variant="outline" asChild>
            <Link to="/ciclo">
              Configurar Matérias
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LockedMetrics;
