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
  image?: string;
  price?: number;
  actualPrice?: number;
}

export type ProductDetail = { [key: string]: string | number | boolean | undefined };

/** `new`, `refurbished` and `used` are the values the backend currently returns. */
export type ProductCondition = 'new' | 'refurbished' | 'used' | (string & {});

export interface Product {
  '@id': string;
  '@type': string;
  id: number;
  uid?: string;
  title?: string;
  category?: Category;
  subcategory?: Subcategory;
  variants?: Variant[];
  actualVariants?: ActualVariant[];
  createdAt?: string;
  updatedAt?: string;
  scrappingUrl?: string;
  seller?: string;
  sellerChoice?: boolean;
  brand?: string;
  photos?: Photo[];
  description?: string;
  usdPrice?: number;
  isAvailable?: boolean;
  customerSays?: string;
  features?: string[];
  details?: ProductDetail[];
  slug?: string;
  /** Selling price in local currency (FCFA). */
  actualPrice?: number;
  previousPrice?: number;
  productCondition?: ProductCondition;
  overallRating?: number;
  acceptReturn?: boolean;
}
