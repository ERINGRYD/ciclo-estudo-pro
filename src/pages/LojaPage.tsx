import BottomNav from "@/components/BottomNav";
import { Store, Zap, Palette, Check, Lock, User, Award, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useInventory, THEMES, AVATARS, TITLES, TROPHIES, ShopItem } from "@/hooks/useInventory";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { name: "Temas", icon: Palette },
  { name: "Avatares", icon: User },
  { name: "Títulos", icon: Award },
  { name: "Troféus", icon: Trophy },
];

const LojaPage = () => {
  const [activeTab, setActiveTab] = useState("Temas");
  const { progress, spendXP } = useUserProgress();
  const { inventory, ownsItem, purchaseItem, equipItem } = useInventory();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Comum": return "text-muted-foreground";
      case "Raro": return "text-info";
      case "Épico": return "text-chart-4";
      case "Lendário": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "Comum": return "bg-muted";
      case "Raro": return "bg-info/20";
      case "Épico": return "bg-chart-4/20";
      case "Lendário": return "bg-warning/20";
      default: return "bg-muted";
    }
  };

  const isEquipped = (item: ShopItem) => {
    switch (item.type) {
      case 'theme': return inventory.equippedTheme === item.id;
      case 'avatar': return inventory.equippedAvatar === item.id;
      case 'title': return inventory.equippedTitle === item.id;
      default: return false;
    }
  };

  const isLocked = (item: ShopItem) => {
    return item.levelRequired && progress.level < item.levelRequired;
  };

  const handlePurchase = (item: ShopItem) => {
    if (!item.price) return;
    
    if (isLocked(item)) {
      toast({
        title: "Item bloqueado",
        description: `Você precisa ser nível ${item.levelRequired} para comprar este item.`,
        variant: "destructive",
      });
      return;
    }

    if (progress.xp < item.price) {
      toast({
        title: "XP insuficiente",
        description: `Você precisa de ${item.price} XP para comprar este item.`,
        variant: "destructive",
      });
      return;
    }

    const success = purchaseItem(item, progress.xp, spendXP);
    if (success) {
      toast({
        title: "Compra realizada!",
        description: `Você comprou ${item.name} por ${item.price} XP.`,
      });
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipItem(item);
    toast({
      title: "Item equipado!",
      description: `${item.name} está agora em uso.`,
    });
  };

  const renderThemeCard = (item: ShopItem) => {
    const owned = ownsItem(item.id);
    const equipped = isEquipped(item);
    const locked = isLocked(item);
    const theme = item as typeof THEMES[0];

    return (
      <div
        key={item.id}
        className={`bg-card rounded-2xl overflow-hidden border transition-all ${
          equipped ? "border-success ring-2 ring-success/20" : "border-border"
        }`}
      >
        <div
          className="h-20 relative"
          style={{
            background: theme.colors 
              ? `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`
              : 'hsl(var(--muted))',
          }}
        >
          {equipped && (
            <div className="absolute top-2 left-2 bg-success text-success-foreground text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="h-3 w-3" />
              Em uso
            </div>
          )}
          {locked && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <div className="text-center text-background">
                <Lock className="h-6 w-6 mx-auto" />
                <span className="text-xs">Nível {item.levelRequired}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <span className={`text-xs font-medium ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{item.description}</p>

          {equipped ? (
            <Button size="sm" variant="outline" className="w-full text-success border-success/30 bg-success/10 hover:bg-success/20" disabled>
              Equipado
            </Button>
          ) : owned ? (
            <Button size="sm" variant="outline" className="w-full" onClick={() => handleEquip(item)}>
              Equipar
            </Button>
          ) : item.price ? (
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-warning-foreground"
              onClick={() => handlePurchase(item)}
              disabled={locked || progress.xp < item.price}
            >
              {item.price} <Zap className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full" onClick={() => handleEquip(item)}>
              Equipar
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderAvatarCard = (item: ShopItem) => {
    const owned = ownsItem(item.id);
    const equipped = isEquipped(item);
    const locked = isLocked(item);
    const avatar = item as typeof AVATARS[0];

    return (
      <div
        key={item.id}
        className={`bg-card rounded-2xl overflow-hidden border transition-all ${
          equipped ? "border-success ring-2 ring-success/20" : "border-border"
        }`}
      >
        <div className={`h-24 relative flex items-center justify-center ${getRarityBg(item.rarity)}`}>
          <span className="text-5xl">{avatar.icon}</span>
          {equipped && (
            <div className="absolute top-2 left-2 bg-success text-success-foreground text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="h-3 w-3" />
              Em uso
            </div>
          )}
          {locked && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <div className="text-center text-background">
                <Lock className="h-6 w-6 mx-auto" />
                <span className="text-xs">Nível {item.levelRequired}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <span className={`text-xs font-medium ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{item.description}</p>

          {equipped ? (
            <Button size="sm" variant="outline" className="w-full text-success border-success/30 bg-success/10 hover:bg-success/20" disabled>
              Equipado
            </Button>
          ) : owned ? (
            <Button size="sm" variant="outline" className="w-full" onClick={() => handleEquip(item)}>
              Equipar
            </Button>
          ) : item.price ? (
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-warning-foreground"
              onClick={() => handlePurchase(item)}
              disabled={locked || progress.xp < item.price}
            >
              {item.price} <Zap className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full" onClick={() => handleEquip(item)}>
              Equipar
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderTitleCard = (item: ShopItem) => {
    const owned = ownsItem(item.id);
    const equipped = isEquipped(item);
    const locked = isLocked(item);

    return (
      <div
        key={item.id}
        className={`bg-card rounded-2xl p-4 border transition-all ${
          equipped ? "border-success ring-2 ring-success/20" : "border-border"
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className={`px-3 py-1.5 rounded-lg ${getRarityBg(item.rarity)}`}>
            <span className={`text-sm font-bold ${getRarityColor(item.rarity)}`}>{item.name}</span>
          </div>
          {equipped && (
            <div className="bg-success text-success-foreground text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="h-3 w-3" />
              Em uso
            </div>
          )}
          {locked && (
            <div className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Nv. {item.levelRequired}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3">{item.description}</p>

        {equipped ? (
          <Button size="sm" variant="outline" className="w-full text-success border-success/30 bg-success/10 hover:bg-success/20" disabled>
            Equipado
          </Button>
        ) : owned ? (
          <Button size="sm" variant="outline" className="w-full" onClick={() => handleEquip(item)}>
            Equipar
          </Button>
        ) : item.price ? (
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-warning-foreground"
            onClick={() => handlePurchase(item)}
            disabled={locked || progress.xp < item.price}
          >
            {item.price} <Zap className="h-3 w-3 ml-1" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full" onClick={() => handleEquip(item)}>
            Equipar
          </Button>
        )}
      </div>
    );
  };

  const renderTrophyCard = (item: ShopItem) => {
    const owned = ownsItem(item.id);
    const trophy = item as typeof TROPHIES[0];

    return (
      <div
        key={item.id}
        className={`bg-card rounded-2xl p-4 border transition-all ${
          owned ? "border-warning/50 bg-warning/5" : "border-border opacity-60"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
            owned ? getRarityBg(item.rarity) : "bg-muted"
          }`}>
            {owned ? trophy.icon : "🔒"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <span className={`text-xs font-medium ${getRarityColor(item.rarity)}`}>
                {item.rarity}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
          </div>
          {owned && (
            <div className="bg-success text-success-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Temas":
        return (
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(renderThemeCard)}
          </div>
        );
      case "Avatares":
        return (
          <div className="grid grid-cols-2 gap-3">
            {AVATARS.map(renderAvatarCard)}
          </div>
        );
      case "Títulos":
        return (
          <div className="grid grid-cols-1 gap-3">
            {TITLES.map(renderTitleCard)}
          </div>
        );
      case "Troféus":
        return (
          <div className="flex flex-col gap-3">
            {TROPHIES.map(renderTrophyCard)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div 
        className="text-primary-foreground p-6 rounded-b-3xl"
        style={{ background: "linear-gradient(135deg, hsl(var(--chart-4)) 0%, hsl(var(--primary)) 100%)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background/20 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Loja de Itens</h1>
              <p className="text-sm opacity-70">Personalize sua jornada</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-background/20 px-3 py-1.5 rounded-full">
            <Zap className="h-4 w-4 text-warning" />
            <span className="font-semibold">{progress.xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {activeTab === "Temas" && "Todos os Temas"}
            {activeTab === "Avatares" && "Todos os Avatares"}
            {activeTab === "Títulos" && "Todos os Títulos"}
            {activeTab === "Troféus" && "Suas Conquistas"}
          </h2>
        </div>
        {renderContent()}
      </div>

      <BottomNav />
    </div>
  );
};

export default LojaPage;
