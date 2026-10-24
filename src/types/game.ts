export interface ItemStage {
  id: string;
  name: string;
  displayName: string;
  syllables: string[];
  distractors: string[];
  hint: string;
  phoneticRule?: string;
  bnccCode: string;
  category: 'furniture' | 'toy' | 'decoration' | 'structure' | 'food' | 'animal';
  icon: string;
  // Posição no cenário do cômodo (porcentagem ou layout)
  roomPlacement: {
    label: string;
    description: string;
    gridArea?: string;
  };
}

export interface WorldRoom {
  id: number;
  title: string;
  shortName: string;
  theme: string;
  description: string;
  icon: string;
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

export interface PlayerProgress {
  completedItems: Record<string, { completedAt: string; stars: number }>;
  completedRooms: Record<number, boolean>;
  starsCount: number;
  activeWorldId: number;
}
