import { Bell, User, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UserHeaderProps {
  userName: string;
  level: number;
  levelTitle: string;
  xp: number;
  levelProgress?: number;
  xpForNextLevel?: number;
  lastSessionDate?: Date | null;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const getLastSessionText = (lastSession: Date | null | undefined): string | null => {
  if (!lastSession) return null;
  const now = new Date();
  const diffMs = now.getTime() - lastSession.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Última sessão: hoje";
  if (diffDays === 1) return "Última sessão: ontem";
  return `Última sessão: há ${diffDays} dias`;
};

const UserHeader = ({ userName, level, levelTitle, xp, levelProgress, xpForNextLevel, lastSessionDate }: UserHeaderProps) => {
  const greeting = getGreeting();
  const lastSessionText = getLastSessionText(lastSessionDate);
  const daysSinceLastSession = lastSessionDate
    ? Math.floor((Date.now() - lastSessionDate.getTime()) / 86400000)
    : null;
  const showInactivityAlert = daysSinceLastSession !== null && daysSinceLastSession >= 3;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{greeting}, {userName}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                Nível {level}
              </span>
              <span className="text-xs text-muted-foreground">{levelTitle}</span>
            </div>
            {lastSessionText && (
              <p className={`text-[10px] mt-0.5 ${showInactivityAlert ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                {showInactivityAlert && <AlertCircle className="w-3 h-3 inline mr-1" />}
                {lastSessionText}
              </p>
            )}
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

      {levelProgress !== undefined && xpForNextLevel !== undefined && (
        <div className="mt-3 px-1">
          <Progress value={levelProgress} className="h-1.5" />
          <p className="text-[10px] text-muted-foreground mt-1 text-right">
            {xp} / {xpForNextLevel} XP para nível {level + 1}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserHeader;
