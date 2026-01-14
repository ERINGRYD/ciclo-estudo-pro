import { Bell, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  userName: string;
  level: number;
  levelTitle: string;
  xp: number;
}

const UserHeader = ({ userName, level, levelTitle, xp }: UserHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Olá, Campeão</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              Nível {level}
            </span>
            <span className="text-xs text-muted-foreground">{levelTitle}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-warning/10 px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm font-semibold text-warning">{xp} XP</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
