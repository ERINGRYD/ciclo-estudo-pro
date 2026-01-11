import BottomNav from "@/components/BottomNav";
import { User, Map, Store, Settings, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: User, label: "Perfil", path: "/perfil" },
  { icon: Map, label: "Jornada", path: "/jornada" },
  { icon: Store, label: "Loja", path: "/loja", active: true },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const MaisPage = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Get the previous page from state or default to home
  const previousPage = location.state?.from || "/";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Blurred Background - iframe of current app */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, hsl(var(--secondary) / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.08) 0%, transparent 70%)
            `,
          }}
        />
        {/* Frosted glass overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen pb-24 flex items-center justify-center">
        {/* Floating Menu */}
        <div className="fixed bottom-32 right-4 z-50">
          {/* Menu Popup with animation */}
          <div
            className={`absolute bottom-16 right-0 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
              menuOpen 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-8 scale-90 pointer-events-none"
            }`}
            style={{ 
              minWidth: "220px",
              transformOrigin: "bottom right",
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item.path)}
                className={`flex items-center gap-4 w-full px-5 py-4 transition-all duration-300 ${
                  item.active 
                    ? "bg-primary/10" 
                    : "hover:bg-muted hover:pl-6"
                } ${index !== menuItems.length - 1 ? "border-b border-border/50" : ""}`}
                style={{
                  animationDelay: menuOpen ? `${index * 75}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateX(0)" : "translateX(20px)",
                  transition: `all 0.4s ease-out ${menuOpen ? index * 75 : 0}ms`,
                }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                  item.active 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={`font-medium text-base ${
                  item.active ? "text-primary" : "text-foreground"
                }`}>
                  {item.label}
                </span>
                {item.active && (
                  <div className="ml-auto w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* FAB Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 ${
              menuOpen ? "rotate-90" : ""
            }`}
          >
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MaisPage;
