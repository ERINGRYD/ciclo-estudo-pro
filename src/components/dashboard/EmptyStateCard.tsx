import { Link } from "react-router-dom";
import { BookOpen, Play, Swords, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateCardProps {
  hasSubjects: boolean;
  hasSessions: boolean;
  hasBattles: boolean;
}

const EmptyStateCard = ({ hasSubjects, hasSessions, hasBattles }: EmptyStateCardProps) => {
  const steps = [
    {
      icon: BookOpen,
      label: "Cadastre suas matérias",
      description: "Organize o que você precisa estudar",
      done: hasSubjects,
      link: "/ciclo",
    },
    {
      icon: Play,
      label: "Faça sua primeira sessão",
      description: "Comece um ciclo de estudos",
      done: hasSessions,
      link: "/ciclo",
    },
    {
      icon: Swords,
      label: "Resolva questões",
      description: "Teste seus conhecimentos no Coliseu",
      done: hasBattles,
      link: "/coliseu",
    },
  ];

  const completedSteps = steps.filter(s => s.done).length;

  return (
    <div className="mb-6">
      <div className="bg-card rounded-2xl p-5 border border-border">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Comece sua jornada! 🚀</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {completedSteps}/{steps.length} passos concluídos
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <Link
              key={step.label}
              to={step.link}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                step.done
                  ? "bg-success/5 border-success/20"
                  : "bg-muted/30 border-border hover:bg-muted/50"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.done ? "bg-success/10" : "bg-primary/10"
              }`}>
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <step.icon className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.done ? "text-success line-through" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyStateCard;
