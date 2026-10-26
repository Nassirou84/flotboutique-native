import type { Product } from './product';

export interface WishlistItem {
  '@id': string;
  '@type': string;
  id: string;
  product: Product;
  createdAt: string;
  priceAtAdd: number;
  variant: { [key: string]: string | number | boolean | null | undefined };
}
