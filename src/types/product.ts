import type { Category, Subcategory } from './category';

export interface Photo {
  '@id'?: string;
  '@type'?: string;
  id?: number;
  url: string;
  isCover?: boolean;
}

export type Variant = { [key: string]: string | number };

/** A purchasable option (storage, config...). `actualPrice` is the FCFA price; `price` is the source currency. */
export interface ActualVariant {
  id: string;
  title: string;
  name?: string;
  image?: string;
  price?: number;
  actualPrice?: number;
  previousPrice?: number;
  amountSaved?: number;
}

export type ProductDetail = { [key: string]: string | number | boolean | undefined };

/** `new`, `refurbished` and `used` are the values the backend currently returns. */
export type ProductCondition = 'new' | 'refurbished' | 'used' | (string & {});

/**
 * A product as served to the app: the `product:read` fields (lists) plus the `product:read:details`
 * ones (single product via `/products/get-one-product`). Fields only in the `product:read:admin`
 * group are never sent here and are kept optional at the bottom for parity with the web type.
 */
export interface Product {
  '@id': string;
  '@type': string;
  id: number;
  title?: string;
  slug?: string;
  uid?: string;
  seller?: string;
  brand?: string;
  photos?: Photo[];
  createdAt?: string;
  productCondition?: ProductCondition;
  /** Current selling price in local currency (FCFA), from `getActualPrice()`. */
  actualPrice?: number;
  /** Previous ("was") price in FCFA for the strike-through, from `getLastPrice()`; null when there is none. */
  lastPrice?: number | null;
  /** `lastPrice − actualPrice`, from `getAmountSaved()`. */
  amountSaved?: number | null;
  overallRating?: number;
  overallRatingsCounts?: number;
  acceptReturn?: boolean;
  primeDelivery?: boolean;
  sellerChoice?: boolean;
  // --- product:read:details only -----------------------------------------------------------
  category?: Category;
  subcategory?: Subcategory;
  description?: string;
  customerSays?: string;
  features?: string[];
  details?: ProductDetail[];
  variants?: Variant[];
  actualVariants?: ActualVariant[];
  // --- admin-only groups, not sent to the app (kept optional for parity) -------------------
  usdPrice?: number;
  isAvailable?: boolean;
  scrappingUrl?: string;
  updatedAt?: string;
}
