import type { Product } from './product';

export interface Basket {
  '@type': 'basket';
  '@id': string;
  id: number;
  basketItems: BasketItem[];
  uid: string;
  createdAt: string;
}

export interface BasketItem {
  '@type': 'basket_item';
  '@id': string;
  id: number;
  product: Product;
  createdAt: string;
  priceAtAdd: number;
  quantity: number;
  variant?: string;
  basket: Basket;
}
