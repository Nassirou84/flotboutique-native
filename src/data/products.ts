import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { API_ORIGIN } from '@/config';
import type { Photo, Product } from '@/types/product';

export type Condition = 'neuf' | 'reconditionne' | 'occasion';

export const CONDITION_LABELS: Record<Condition, string> = {
  reconditionne: 'Reconditionné A+',
  neuf: 'Neuf Scellé',
  occasion: 'Occasion Vérifiée',
};

// Backend `productCondition` values -> the app's three certified states.
export const CONDITION_FROM_API: Record<string, Condition> = {
  new: 'neuf',
  refurbished: 'reconditionne',
  used: 'occasion',
};

/** Inverse of `CONDITION_FROM_API`: the value the API's `productCondition` filter expects. */
export const CONDITION_TO_API: Record<Condition, string> = {
  neuf: 'new',
  reconditionne: 'refurbished',
  occasion: 'used',
};

/** What the product cards render. Optional fields are hidden when the API doesn't provide them. */
export type ProductView = {
  id: number;
  /** JSON-LD IRI, needed to reference the product when writing to the wishlist. */
  iri: string;
  slug?: string;
  name: string;
  brand?: string;
  condition?: Condition;
  price?: number;
  oldPrice?: number;
  image?: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

export const resolveImage = (url?: string) => {
  if (!url) return undefined;
  return /^https?:\/\//.test(url) ? url : `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

/** URL of the photo flagged as cover, or of the first one when none is. */
export const coverPhotoUrl = (photos?: Photo[]) => (photos?.find((p) => p.isCover) ?? photos?.[0])?.url;

export function toProductView(p: Product): ProductView {
  return {
    id: p.id,
    iri: p['@id'],
    slug: p.slug,
    name: p.title ?? '',
    brand: p.brand,
    condition: p.productCondition ? CONDITION_FROM_API[p.productCondition] : undefined,
    price: p.actualPrice,
    oldPrice: p.previousPrice && p.previousPrice > (p.actualPrice ?? 0) ? p.previousPrice : undefined,
    image: resolveImage(coverPhotoUrl(p.photos)),
    icon: 'cube-outline',
  };
}
