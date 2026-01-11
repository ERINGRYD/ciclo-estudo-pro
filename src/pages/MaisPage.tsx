import BottomNav from "@/components/BottomNav";
import { User, Map, Store, Settings, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: User, label: "Perfil", path: "/perfil" },
  { icon: Map, label: "Jornada", path: "/jornada" },
  { icon: Store, label: "Loja", path: "/loja", active: true },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const MaisPage = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
      {/* Floating Menu */}
      <div className="fixed bottom-32 right-4 z-50">
        {/* Menu Popup */}
        <div
          className={`absolute bottom-16 right-0 bg-card border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
            menuOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
          style={{ minWidth: "200px" }}
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.path)}
              className={`flex items-center gap-4 w-full px-5 py-4 transition-colors ${
                item.active 
                  ? "bg-primary/10" 
                  : "hover:bg-muted"
              } ${index !== menuItems.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.active 
                  ? "bg-primary text-primary-foreground" 
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
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* FAB Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MaisPage;
