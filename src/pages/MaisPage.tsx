import BottomNav from "@/components/BottomNav";
import { MoreHorizontal, Settings, HelpCircle, Info, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Settings, label: "Configurações", description: "Personalize o aplicativo" },
  { icon: HelpCircle, label: "Ajuda", description: "Central de suporte" },
  { icon: Info, label: "Sobre", description: "Informações do app" },
];

const MaisPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-primary/10">
            <MoreHorizontal className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Mais Opções</h1>
        </div>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
            >
              <item.icon className="h-5 w-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MaisPage;
