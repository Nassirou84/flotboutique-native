import type { Product, Variant } from './product';

/**
 * Basket as returned by `GetBasketController` (through `BasketService::normalizeWithTotal`):
 * plain JSON, not JSON-LD, so no `@id`/`@type`.
 */
export interface Basket {
  id: number;
  basketItems: BasketItem[];
  uid: string;
  createdAt: string;
  /** Server-computed sum of priceAtAdd × quantity over the basket items. */
  total: number;
}

/** A basket line as serialized by `BasketItem::jsonSerialize()`. */
export interface BasketItem {
  id: number;
  product: Product;
  createdAt: string;
  priceAtAdd: number;
  quantity: number;
  /** The whole selected variant object (title, price, ...), or null when the product has none. */
  variant?: Variant | null;
  priceDropNotifiedAt?: string | null;
  /** uid of the owning basket (the server sends the uid here, not the full basket). */
  basket?: string;
}
