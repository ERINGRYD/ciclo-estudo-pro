import {
  Flag, Star, Trophy, Zap, Target, Swords, Crown, Medal, Rocket,
  BarChart3, PieChart, Brain, TrendingUp, Palette, Timer, Shield,
  Award, Gem, Sparkles, Gift
} from "lucide-react";

export type UnlockCategory = "feature" | "cosmetic" | "mission" | "metric" | "mode";

export interface LevelUnlock {
  level: number;
  category: UnlockCategory;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const LEVEL_UNLOCKS: LevelUnlock[] = [
  // Nível 1
  { level: 1, category: "feature", name: "Ciclo de Estudos", description: "Gerencie suas matérias e sessões de estudo", icon: Flag },
  { level: 1, category: "feature", name: "Batalha de Questões", description: "Modo clássico de perguntas e respostas", icon: Swords },

  // Nível 2
  { level: 2, category: "mission", name: "Missão Bônus", description: "+1 slot de missão diária disponível", icon: Gift },

  // Nível 3
  { level: 3, category: "metric", name: "Progresso por Matéria", description: "Visualize seu avanço em cada matéria", icon: BarChart3 },
  { level: 3, category: "cosmetic", name: "Avatar Guerreiro", description: "Novo avatar disponível na loja", icon: Shield },

  // Nível 4
  { level: 4, category: "mode", name: "Modo Cronometrado", description: "Batalhas com tempo limitado por questão", icon: Timer },

  // Nível 5
  { level: 5, category: "mission", name: "3 Missões Diárias", description: "Slot extra de missão diária desbloqueado", icon: Target },
  { level: 5, category: "metric", name: "Análise de Desempenho", description: "Estatísticas detalhadas do seu progresso", icon: PieChart },
  { level: 5, category: "cosmetic", name: "Tema Oceano", description: "Novo tema visual disponível na loja", icon: Palette },

  // Nível 7
  { level: 7, category: "mode", name: "Operação Resgate", description: "Revise questões que errou anteriormente", icon: Brain },

  // Nível 8
  { level: 8, category: "metric", name: "Metas Inteligentes", description: "Metas personalizadas baseadas no seu ritmo", icon: TrendingUp },
  { level: 8, category: "cosmetic", name: "Avatar Rei", description: "Avatar premium disponível na loja", icon: Crown },

  // Nível 10
  { level: 10, category: "cosmetic", name: "Tema Midas", description: "Tema dourado exclusivo na loja", icon: Sparkles },
  { level: 10, category: "cosmetic", name: "Troféu Elite", description: "Troféu de prestígio no seu perfil", icon: Trophy },

  // Nível 12
  { level: 12, category: "metric", name: "Insights Avançados", description: "Análises profundas com IA sobre seu estudo", icon: Brain },
  { level: 12, category: "cosmetic", name: "Título: Lenda Viva", description: "Título especial exibido no seu perfil", icon: Medal },

  // Nível 15
  { level: 15, category: "mission", name: "Missão Especial", description: "Missão diária com bônus de XP dobrado", icon: Star },

  // Nível 20
  { level: 20, category: "cosmetic", name: "Coroa Suprema", description: "Recompensa final — símbolo de maestria total", icon: Gem },
  { level: 20, category: "feature", name: "Modo Lendário", description: "Desafios exclusivos para os melhores", icon: Rocket },
];

/** Get all unlocks for a specific level */
export const getUnlocksForLevel = (level: number): LevelUnlock[] => {
  return LEVEL_UNLOCKS.filter(u => u.level === level);
};

/** Get all unlocked items up to a given level */
export const getUnlockedUpTo = (level: number): LevelUnlock[] => {
  return LEVEL_UNLOCKS.filter(u => u.level <= level);
};

/** Get the next unlocks coming after the current level */
export const getNextUnlocks = (currentLevel: number): { level: number; unlocks: LevelUnlock[] } | null => {
  const futureUnlocks = LEVEL_UNLOCKS.filter(u => u.level > currentLevel);
  if (futureUnlocks.length === 0) return null;
  const nextLevel = Math.min(...futureUnlocks.map(u => u.level));
  return {
    level: nextLevel,
    unlocks: futureUnlocks.filter(u => u.level === nextLevel),
  };
};

/** Get all unique levels that have unlocks */
export const getUnlockLevels = (): number[] => {
  return [...new Set(LEVEL_UNLOCKS.map(u => u.level))].sort((a, b) => a - b);
};

/** Category display info */
export const CATEGORY_LABELS: Record<UnlockCategory, { label: string; color: string }> = {
  feature: { label: "Funcionalidade", color: "text-info" },
  cosmetic: { label: "Cosmético", color: "text-primary" },
  mission: { label: "Missão", color: "text-warning" },
  metric: { label: "Métrica", color: "text-success" },
  mode: { label: "Modo", color: "text-destructive" },
};
