import type { Condition } from '@/data/products';
import { colors } from '@/theme/colors';

export type Category = 'all' | Condition;
export type Sort = 'popularity' | 'price-asc' | 'price-desc';

export const CATEGORIES: { key: Category; label: string; dot?: string }[] = [
  { key: 'all', label: 'Tous les produits' },
  { key: 'neuf', label: 'Neuf Scellé', dot: colors.green },
  { key: 'reconditionne', label: 'Reconditionné A+', dot: '#1D4ED8' },
  { key: 'occasion', label: 'Occasion Vérifiée', dot: colors.orange },
];

export const SORT_LABELS: Record<Sort, string> = {
  popularity: 'Popularité',
  'price-asc': 'Prix croissant',
  'price-desc': 'Prix décroissant',
};
export const SORT_ORDER: Sort[] = ['popularity', 'price-asc', 'price-desc'];

export const isCategory = (v: unknown): v is Category =>
  v === 'all' || v === 'neuf' || v === 'reconditionne' || v === 'occasion';
