export interface PricingPlan {
  id: 'SINGLE_ROOM' | 'FULL_HOUSE' | 'UPGRADE_HOUSE';
  price: number;
  originalPrice?: number;
  label: string;
  badge?: string;
  description: string;
}

export const PRICING = {
  SINGLE_ROOM: {
    id: 'SINGLE_ROOM',
    price: 5.0,
    label: 'Cômodo Avulso',
    description: 'Desbloqueie apenas este cômodo da casa para sempre.',
  },
  FULL_HOUSE: {
    id: 'FULL_HOUSE',
    price: 15.0,
    originalPrice: 20.0, // 4 cômodos restantes x R$ 5 = R$ 20
    label: 'Casa Completa',
    badge: 'Mais Escolhido pelos Pais ⭐',
    description: 'Desbloqueie todos os 6 cômodos da casa (48 palavras e móveis).',
  },
  UPGRADE_HOUSE: {
    id: 'UPGRADE_HOUSE',
    price: 10.0, // R$ 15 - R$ 5 = R$ 10
    label: 'Completar a Casa',
    badge: 'Desconto de Upgrade',
    description: 'Pague apenas a diferença para desbloquear o restante da casa.',
  },
} as const;
