import type { Product } from './product';

export enum OrderStatus {
  ALL = 'all_statuses',
  PLACED = 'placed',
  PROCESSING = 'processing',
  TRANSIT = 'in_transit',
  ARRIVED_IN_FACILITY = 'arrived_in_facility',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  '@id': string;
  '@type': string;
  id: number;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  product: Product;
  status: string;
  updatedAt?: string;
}

export interface Order {
  '@id': string;
  '@type': string;
  id: number;
  orderPrice: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  uid: string;
  estimatedDeliveryAt: string;
  country: string;
  products: OrderItem[];
}
