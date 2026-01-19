import { Link } from "react-router-dom";
import { BarChart3, Lock, TrendingUp, Target, Brain, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LockedMetricsProps {
  userLevel: number;
}

interface MetricUnlock {
  level: number;
  name: string;
  icon: React.ElementType;
  component: React.ReactNode;
}

const LockedMetrics = ({ userLevel }: LockedMetricsProps) => {
  // Define which metrics unlock at which levels
  const metricUnlocks: MetricUnlock[] = [
    {
      level: 3,
      name: "Progresso por Matéria",
      icon: BarChart3,
      component: <SubjectProgressMetric />,
    },
    {
      level: 5,
      name: "Análise de Desempenho",
      icon: TrendingUp,
      component: <PerformanceAnalysisMetric />,
    },
    {
      level: 8,
      name: "Metas Inteligentes",
      icon: Target,
      component: <SmartGoalsMetric />,
    },
    {
      level: 12,
      name: "Insights Avançados",
      icon: Brain,
      component: <AdvancedInsightsMetric />,
    },
  ];

  const unlockedMetrics = metricUnlocks.filter(m => userLevel >= m.level);
  const nextLockedMetric = metricUnlocks.find(m => userLevel < m.level);

  if (unlockedMetrics.length === metricUnlocks.length) {
    // All metrics unlocked - show all
    return (
      <div className="mb-24 space-y-4">
        {unlockedMetrics.map((metric) => (
          <div key={metric.name}>{metric.component}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-24 space-y-4">
      {/* Show unlocked metrics */}
      {unlockedMetrics.map((metric) => (
        <div key={metric.name}>{metric.component}</div>
      ))}

      {/* Show next locked metric */}
      {nextLockedMetric && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <nextLockedMetric.icon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{nextLockedMetric.name}</h2>
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
              <h3 className="font-semibold text-foreground mb-2">
                Desbloqueia no Nível {nextLockedMetric.level}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-3">
                Continue estudando para desbloquear {nextLockedMetric.name.toLowerCase()}!
              </p>
              <div className="w-48 mb-4">
                <Progress value={(userLevel / nextLockedMetric.level) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Nível {userLevel} / {nextLockedMetric.level}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/coliseu">Ganhar XP</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Unlockable metric components
const SubjectProgressMetric = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Progresso por Matéria</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 3</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="space-y-3">
          {[
            { name: "Matemática", progress: 75, color: "bg-chart-1" },
            { name: "Português", progress: 60, color: "bg-chart-2" },
            { name: "História", progress: 45, color: "bg-chart-3" },
          ].map((subject) => (
            <div key={subject.name} className="flex items-center gap-3">
              <span className="text-sm w-24 truncate">{subject.name}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${subject.color} rounded-full transition-all`}
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10">{subject.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceAnalysisMetric = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-success" />
        <h2 className="text-lg font-semibold text-foreground">Análise de Desempenho</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 5</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <p className="text-2xl font-bold text-success">+15%</p>
            <p className="text-xs text-muted-foreground">Melhora semanal</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <p className="text-2xl font-bold text-primary">78%</p>
            <p className="text-xs text-muted-foreground">Taxa de acerto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartGoalsMetric = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold text-foreground">Metas Inteligentes</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 8</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Meta Semanal</p>
            <p className="text-sm text-muted-foreground">50 questões restantes</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-warning">70%</p>
            <p className="text-xs text-muted-foreground">Concluído</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedInsightsMetric = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-chart-4" />
        <h2 className="text-lg font-semibold text-foreground">Insights Avançados</h2>
        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Nível 12</span>
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-chart-4" />
            <p className="text-sm">Melhor horário de estudo: <span className="font-medium">19h-21h</span></p>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-chart-4" />
            <p className="text-sm">Matéria mais forte: <span className="font-medium">Matemática</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedMetrics;
