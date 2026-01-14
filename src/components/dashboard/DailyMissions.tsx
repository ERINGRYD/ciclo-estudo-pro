import { Dumbbell, BookOpen, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Mission {
  id: string;
  icon: React.ElementType;
  title: string;
  xp: number;
  description: string;
  current: number;
  target: number;
  iconColor: string;
  iconBg: string;
}

interface DailyMissionsProps {
  expiresIn: string;
}

const DailyMissions = ({ expiresIn }: DailyMissionsProps) => {
  const missions: Mission[] = [
    {
      id: "1",
      icon: Dumbbell,
      title: "Treino Intenso",
      xp: 50,
      description: "Complete 20 questões de Matemática",
      current: 15,
      target: 20,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      id: "2",
      icon: BookOpen,
      title: "Leitura Veloz",
      xp: 30,
      description: "Leia 2 resumos de História",
      current: 0,
      target: 2,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Missões Diárias</h2>
        <span className="text-xs text-muted-foreground">Expira em {expiresIn}</span>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${mission.iconBg} flex items-center justify-center flex-shrink-0`}>
                <mission.icon className={`w-5 h-5 ${mission.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-foreground">{mission.title}</h3>
                  <div className="flex items-center gap-1 bg-warning/10 px-2 py-0.5 rounded-full">
                    <Zap className="w-3 h-3 text-warning" />
                    <span className="text-xs font-medium text-warning">{mission.xp} XP</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(mission.current / mission.target) * 100} 
                    className="h-2 flex-1"
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {mission.current}/{mission.target}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyMissions;
