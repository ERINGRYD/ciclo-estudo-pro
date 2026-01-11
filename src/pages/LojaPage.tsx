import BottomNav from "@/components/BottomNav";
import { Store, Zap, Palette, Check, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const tabs = ["Temas", "Avatares", "Títulos", "Troféus"];

const themes = [
  { name: "Padrão", rarity: "Comum", description: "O clássico limpo.", equipped: true, price: null, colors: ["#e0e7ff", "#c7d2fe", "#a5b4fc"] },
  { name: "Noturno", rarity: "Comum", description: "Foco total no escuro.", equipped: false, price: null, colors: ["#1e293b", "#334155", "#475569"] },
  { name: "Oceano", rarity: "Raro", description: "Calma e profundidade.", equipped: false, price: 500, colors: ["#06b6d4", "#0891b2", "#0e7490"] },
  { name: "Sunset", rarity: "Raro", description: "Vibrações de verão.", equipped: false, price: 500, colors: ["#f97316", "#fb923c", "#fdba74"] },
  { name: "Floresta", rarity: "Épico", description: "Conexão com a natureza.", equipped: false, price: 1200, colors: ["#22c55e", "#16a34a", "#15803d"] },
  { name: "Midas", rarity: "Lendário", description: "Luxo absoluto.", equipped: false, price: 5000, locked: true, colors: ["#fbbf24", "#f59e0b", "#d97706"] },
];


const LojaPage = () => {
  const [activeTab, setActiveTab] = useState("Temas");

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Comum": return "text-gray-500";
      case "Raro": return "text-blue-500";
      case "Épico": return "text-purple-500";
      case "Lendário": return "text-amber-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Loja de Itens</h1>
              <p className="text-sm text-white/70">Personalize sua jornada</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-amber-300" />
            <span className="font-semibold">2.450 XP</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
            Novidade
          </div>
          <h3 className="text-lg font-bold mt-2">Coleção Cyberpunk</h3>
          <p className="text-sm text-white/80 mb-3">Temas neon e avatares futuristas.</p>
          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
            Ver Coleção
          </Button>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-bold text-foreground">Todos os Temas</h2>
          </div>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Filtrar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className={`bg-card rounded-2xl overflow-hidden border ${
                theme.equipped ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-border"
              }`}
            >
              {/* Theme Preview */}
              <div
                className="h-20 relative"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
                }}
              >
                {theme.equipped && (
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Em uso
                  </div>
                )}
                {theme.locked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white/70" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{theme.name}</h3>
                  <span className={`text-xs font-medium ${getRarityColor(theme.rarity)}`}>
                    {theme.rarity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{theme.description}</p>

                {theme.equipped ? (
                  <Button size="sm" variant="outline" className="w-full text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                    Equipado
                  </Button>
                ) : theme.price ? (
                  <Button size="sm" className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-900">
                    {theme.price} <Zap className="h-3 w-3 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full">
                    Equipar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LojaPage;
