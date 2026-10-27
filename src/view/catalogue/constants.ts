import type { GetAllProductsFilters } from '@/api/product/products';
import { CONDITION_TO_API, type Condition } from '@/data/products';
import { colors } from '@/theme/colors';

/** Single-choice row above the list, like the web storefront's tags. */
export type Tag = 'all' | Condition | 'sellerChoice' | 'primeDelivery';
export type Sort = 'newest' | 'price-asc' | 'price-desc';

export const TAGS: { key: Tag; label: string; dot?: string }[] = [
  { key: 'all', label: 'Tous les produits' },
  { key: 'neuf', label: 'Neuf Scellé', dot: colors.green },
  { key: 'reconditionne', label: 'Reconditionné A+', dot: '#1D4ED8' },
  { key: 'occasion', label: 'Occasion Vérifiée', dot: colors.orange },
  { key: 'sellerChoice', label: 'Coup de cœur' },
  { key: 'primeDelivery', label: 'Livraison rapide' },
];

export const SORT_LABELS: Record<Sort, string> = {
  newest: 'Nouveautés',
  'price-asc': 'Prix croissant',
  'price-desc': 'Prix décroissant',
};
export const SORT_ORDER: Sort[] = ['newest', 'price-asc', 'price-desc'];

/** Order clauses the API understands (`products.order_filter`): same as the web storefront. */
export const SORT_CLAUSES: Record<Sort, string> = {
  newest: '[createdAt]=desc',
  'price-asc': '[usdPrice]=asc',
  'price-desc': '[usdPrice]=desc',
};

export const isTag = (v: unknown): v is Tag => TAGS.some((t) => t.key === v);

/** API filters behind each tag (`productCondition`, `sellerChoice`, `primeDelivery`). */
export const tagFilters = (tag: Tag): Pick<GetAllProductsFilters, 'productCondition' | 'sellerChoice' | 'primeDelivery'> => {
  if (tag === 'sellerChoice') return { sellerChoice: true };
  if (tag === 'primeDelivery') return { primeDelivery: true };
  if (tag === 'all') return {};
  return { productCondition: CONDITION_TO_API[tag] };
};

/** What the filters panel edits. Prices are digits only, in the storefront currency; empty means no bound. */
export type CatalogueFilters = { category: string; subcategory: string; minPrice: string; maxPrice: string };

export const EMPTY_FILTERS: CatalogueFilters = { category: '', subcategory: '', minPrice: '', maxPrice: '' };

/** Filters shown as a badge on the filters button: category (with its subcategory) and price range. */
export const countActiveFilters = (f: CatalogueFilters) => (f.category ? 1 : 0) + (f.minPrice || f.maxPrice ? 1 : 0);

export const priceFilters = (f: CatalogueFilters): Pick<GetAllProductsFilters, 'minPrice' | 'maxPrice'> => ({
  minPrice: f.minPrice ? Number(f.minPrice) : undefined,
  maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
});
