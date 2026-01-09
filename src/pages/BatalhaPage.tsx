import BottomNav from "@/components/BottomNav";
import { Swords } from "lucide-react";

const BatalhaPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Swords className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Batalha</h1>
          <p className="text-muted-foreground">
            Desafie-se em batalhas de conhecimento.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BatalhaPage;
