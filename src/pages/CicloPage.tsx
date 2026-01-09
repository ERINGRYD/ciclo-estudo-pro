import BottomNav from "@/components/BottomNav";
import { PieChart } from "lucide-react";

const CicloPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <PieChart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Ciclo de Estudos</h1>
          <p className="text-muted-foreground">
            Gerencie seus ciclos de estudo aqui.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default CicloPage;
