import { useState, useEffect, useCallback } from 'react';

export interface ShopItem {
  id: string;
  name: string;
  type: 'theme' | 'avatar' | 'title' | 'trophy';
  rarity: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
  description: string;
  price: number | null;
  levelRequired?: number;
  colors?: string[];
  icon?: string;
}

export interface UserInventory {
  ownedItems: string[];
  equippedTheme: string;
  equippedAvatar: string;
  equippedTitle: string;
}

const INVENTORY_KEY = 'user-inventory';

const DEFAULT_INVENTORY: UserInventory = {
  ownedItems: ['theme-padrao', 'theme-noturno', 'avatar-default', 'title-recruta'],
  equippedTheme: 'theme-padrao',
  equippedAvatar: 'avatar-default',
  equippedTitle: 'title-recruta',
};

// All shop items
export const THEMES: ShopItem[] = [
  { id: 'theme-padrao', name: 'Padrão', type: 'theme', rarity: 'Comum', description: 'O clássico limpo.', price: null, colors: ['#e0e7ff', '#c7d2fe', '#a5b4fc'] },
  { id: 'theme-noturno', name: 'Noturno', type: 'theme', rarity: 'Comum', description: 'Foco total no escuro.', price: null, colors: ['#1e293b', '#334155', '#475569'] },
  { id: 'theme-oceano', name: 'Oceano', type: 'theme', rarity: 'Raro', description: 'Calma e profundidade.', price: 500, colors: ['#06b6d4', '#0891b2', '#0e7490'] },
  { id: 'theme-sunset', name: 'Sunset', type: 'theme', rarity: 'Raro', description: 'Vibrações de verão.', price: 500, colors: ['#f97316', '#fb923c', '#fdba74'] },
  { id: 'theme-floresta', name: 'Floresta', type: 'theme', rarity: 'Épico', description: 'Conexão com a natureza.', price: 1200, colors: ['#22c55e', '#16a34a', '#15803d'] },
  { id: 'theme-midas', name: 'Midas', type: 'theme', rarity: 'Lendário', description: 'Luxo absoluto.', price: 5000, levelRequired: 10, colors: ['#fbbf24', '#f59e0b', '#d97706'] },
];

export const AVATARS: ShopItem[] = [
  { id: 'avatar-default', name: 'Padrão', type: 'avatar', rarity: 'Comum', description: 'Avatar padrão.', price: null, icon: '👤' },
  { id: 'avatar-warrior', name: 'Guerreiro', type: 'avatar', rarity: 'Raro', description: 'Espírito de luta.', price: 300, icon: '⚔️' },
  { id: 'avatar-mage', name: 'Mago', type: 'avatar', rarity: 'Raro', description: 'Sabedoria ancestral.', price: 300, icon: '🧙' },
  { id: 'avatar-knight', name: 'Cavaleiro', type: 'avatar', rarity: 'Épico', description: 'Honra e glória.', price: 800, icon: '🛡️' },
  { id: 'avatar-dragon', name: 'Dragão', type: 'avatar', rarity: 'Épico', description: 'Poder indomável.', price: 1000, icon: '🐲' },
  { id: 'avatar-crown', name: 'Rei', type: 'avatar', rarity: 'Lendário', description: 'Majestade absoluta.', price: 3000, levelRequired: 8, icon: '👑' },
];

export const TITLES: ShopItem[] = [
  { id: 'title-recruta', name: 'Recruta', type: 'title', rarity: 'Comum', description: 'Título inicial.', price: null },
  { id: 'title-estudante', name: 'Estudante Dedicado', type: 'title', rarity: 'Comum', description: 'Para quem não desiste.', price: null },
  { id: 'title-combatente', name: 'Combatente', type: 'title', rarity: 'Raro', description: 'Forjado em batalhas.', price: 400 },
  { id: 'title-estrategista', name: 'Estrategista', type: 'title', rarity: 'Raro', description: 'Mente afiada.', price: 400 },
  { id: 'title-mestre', name: 'Mestre do Conhecimento', type: 'title', rarity: 'Épico', description: 'Domínio absoluto.', price: 1500 },
  { id: 'title-lenda', name: 'Lenda Viva', type: 'title', rarity: 'Lendário', description: 'Inspiração para todos.', price: 4000, levelRequired: 12 },
];

export const TROPHIES: ShopItem[] = [
  { id: 'trophy-first-battle', name: 'Primeira Batalha', type: 'trophy', rarity: 'Comum', description: 'Complete sua primeira batalha.', price: null, icon: '🎖️' },
  { id: 'trophy-10-wins', name: '10 Vitórias', type: 'trophy', rarity: 'Raro', description: 'Vença 10 batalhas.', price: null, icon: '🏆' },
  { id: 'trophy-100-questions', name: 'Centurião', type: 'trophy', rarity: 'Épico', description: 'Responda 100 questões.', price: null, icon: '💯' },
  { id: 'trophy-level-10', name: 'Elite', type: 'trophy', rarity: 'Lendário', description: 'Alcance o nível 10.', price: null, icon: '⭐' },
];

export const useInventory = () => {
  const [inventory, setInventory] = useState<UserInventory>(DEFAULT_INVENTORY);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(INVENTORY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInventory({ ...DEFAULT_INVENTORY, ...parsed });
      } catch {
        setInventory(DEFAULT_INVENTORY);
      }
    }
  }, []);

  // Save inventory
  const saveInventory = useCallback((newInventory: UserInventory) => {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
    setInventory(newInventory);
  }, []);

  // Check if user owns an item
  const ownsItem = useCallback((itemId: string): boolean => {
    return inventory.ownedItems.includes(itemId);
  }, [inventory.ownedItems]);

  // Purchase an item (returns success boolean)
  const purchaseItem = useCallback((item: ShopItem, currentXP: number, spendXP: (amount: number) => boolean): boolean => {
    if (!item.price) return false;
    if (ownsItem(item.id)) return false;
    if (currentXP < item.price) return false;

    const success = spendXP(item.price);
    if (success) {
      const newInventory = {
        ...inventory,
        ownedItems: [...inventory.ownedItems, item.id],
      };
      saveInventory(newInventory);
      return true;
    }
    return false;
  }, [inventory, ownsItem, saveInventory]);

  // Equip an item
  const equipItem = useCallback((item: ShopItem) => {
    if (!ownsItem(item.id)) return false;

    const newInventory = { ...inventory };
    switch (item.type) {
      case 'theme':
        newInventory.equippedTheme = item.id;
        break;
      case 'avatar':
        newInventory.equippedAvatar = item.id;
        break;
      case 'title':
        newInventory.equippedTitle = item.id;
        break;
    }
    saveInventory(newInventory);
    return true;
  }, [inventory, ownsItem, saveInventory]);

  // Get equipped item
  const getEquippedTheme = useCallback(() => {
    return THEMES.find(t => t.id === inventory.equippedTheme) || THEMES[0];
  }, [inventory.equippedTheme]);

  const getEquippedAvatar = useCallback(() => {
    return AVATARS.find(a => a.id === inventory.equippedAvatar) || AVATARS[0];
  }, [inventory.equippedAvatar]);

  const getEquippedTitle = useCallback(() => {
    return TITLES.find(t => t.id === inventory.equippedTitle) || TITLES[0];
  }, [inventory.equippedTitle]);

  // Unlock trophy (for achievements)
  const unlockTrophy = useCallback((trophyId: string) => {
    if (inventory.ownedItems.includes(trophyId)) return;
    const newInventory = {
      ...inventory,
      ownedItems: [...inventory.ownedItems, trophyId],
    };
    saveInventory(newInventory);
  }, [inventory, saveInventory]);

  return {
    inventory,
    ownsItem,
    purchaseItem,
    equipItem,
    getEquippedTheme,
    getEquippedAvatar,
    getEquippedTitle,
    unlockTrophy,
    THEMES,
    AVATARS,
    TITLES,
    TROPHIES,
  };
};
