import { Link } from "react-router-dom";
import { BookOpen, Swords, Trophy } from "lucide-react";

const actions = [
  { icon: BookOpen, label: "Estudar", to: "/ciclo", color: "bg-primary/10 text-primary" },
  { icon: Swords, label: "Questões", to: "/coliseu", color: "bg-warning/10 text-warning" },
  { icon: Trophy, label: "Batalha", to: "/batalha", color: "bg-success/10 text-success" },
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.to}
          className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
            <action.icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
