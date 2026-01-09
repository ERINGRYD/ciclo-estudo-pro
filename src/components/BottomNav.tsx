import { Home, PieChart, Swords, Trophy, MoreHorizontal } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/ciclo", icon: PieChart, label: "Ciclo" },
  { to: "/batalha", icon: Swords, label: "Batalha" },
  { to: "/coliseu", icon: Trophy, label: "Coliseu" },
  { to: "/mais", icon: MoreHorizontal, label: "Mais" },
];

const BottomNav = () => {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 pb-safe-area z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] h-[80px]">
        <div className="flex justify-around items-center h-full max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 w-16 group transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "relative p-1.5 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary/10"
                        : "group-hover:scale-110"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px]",
                      isActive ? "font-bold" : "font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="h-[88px]" />
    </>
  );
};

export default BottomNav;
