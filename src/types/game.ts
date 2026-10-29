export interface ItemStage {
  id: string;
  name: string;
  displayName: string;
  syllables: string[];
  distractors: string[];
  hint: string;
  phoneticRule?: string;
  bnccCode: string;
  category: 'furniture' | 'toy' | 'decoration' | 'structure' | 'food' | 'animal' | 'plant' | 'utensil' | 'clothing';
  icon: string;
  image?: string;
  visualPrompt?: string; // Prompt visual descritivo opcional para o gerador de imagens
  // Posição no cenário do cômodo (porcentagem ou layout)
  roomPlacement: {
    label: string;
    description: string;
    gridArea?: string;
    x?: number; // % da esquerda no cenário (0 a 100)
    y?: number; // % do topo no cenário (0 a 100)
    size?: number; // tamanho recomendado em px
  };
}

export interface WorldRoom {
  id: number;
  title: string;
  shortName: string;
  theme: string;
  description: string;
  icon: string;
  hidden?: boolean; // Oculta o mundo temporariamente da navegação/mapa
  requiredStars?: number; // Estrelas globais necessárias para desbloquear
  sceneImage?: string;
  sceneSubtitle?: string;
  completedTitle?: string;
  completedBanner?: string;
  placementLabel?: string;
  color: {
    primary: string;
    accent: string;
    border: string;
    bg: string;
  };
  items: ItemStage[];
}

export interface ParentSettings {
  screenTimeLimitMinutes: number; // 0 = sem limite, 15, 20, 30
  childName?: string;
  enableSoundEffects?: boolean;
}

export interface MemoryCard {
  id: string; // Ex: 'cama-image' ou 'cama-word'
  itemId: string; // 'cama'
  type: 'image' | 'word';
  label: string; // 'CAMA'
  imageSrc?: string;
  fallbackIcon?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface PlayerProgress {
  completedItems: Record<string, { completedAt: string; stars: number }>;
  completedRooms: Record<number, boolean>;
  completedMemoryRooms?: Record<number, boolean>;
  completedMemoryLevels?: Record<number, number>; // worldId -> nível máximo vencido (1, 2, 3 ou 4)
  starsCount: number;
  activeWorldId: number;
  parentSettings?: ParentSettings;
}
