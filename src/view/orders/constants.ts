import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import { OrderStatus } from '@/types/order';
import { notifyError } from '@/utils/notify';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Placeholder screen: actions without an API behind them stay stubbed. */
export const comingSoon = (feature: string) => notifyError(`${feature} sera bientôt disponible.`, 'Bientôt disponible');

export type OrdersTabKey = 'all' | 'active' | 'delivered' | 'cancelled';

/** Everything that is neither delivered nor cancelled, as the API's `countActiveOrders` defines it. */
export const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PROCESSING,
  OrderStatus.TRANSIT,
  OrderStatus.ARRIVED_IN_FACILITY,
  OrderStatus.OUT_FOR_DELIVERY,
];

export const isActiveStatus = (status: OrderStatus) => ACTIVE_STATUSES.includes(status);

/** `status` filter sent to the API for each tab. */
export const TAB_FILTERS: Record<OrdersTabKey, Record<string, string | string[]>> = {
  all: {},
  active: { status: ACTIVE_STATUSES },
  delivered: { status: OrderStatus.DELIVERED },
  cancelled: { status: OrderStatus.CANCELLED },
};

export const ORDERS_TABS: { key: OrdersTabKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'active', label: 'En cours' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

export const DELIVERY_STEPS = ['Commandée', 'Préparation', 'En transit', 'En livraison', 'Livrée'];

/** Number of completed steps in `DELIVERY_STEPS` (the last completed one is the current step). */
export const completedSteps = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PROCESSING:
      return 2;
    case OrderStatus.TRANSIT:
    case OrderStatus.ARRIVED_IN_FACILITY:
      return 3;
    case OrderStatus.OUT_FOR_DELIVERY:
      return 4;
    case OrderStatus.DELIVERED:
      return 5;
    default:
      return 1;
  }
};

export const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.PLACED]: 'Commandée',
  [OrderStatus.PROCESSING]: 'En préparation',
  [OrderStatus.TRANSIT]: 'En transit',
  [OrderStatus.ARRIVED_IN_FACILITY]: 'Arrivée au dépôt',
  [OrderStatus.OUT_FOR_DELIVERY]: 'En livraison',
  [OrderStatus.DELIVERED]: 'Livrée',
  [OrderStatus.CANCELLED]: 'Annulée',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  completed: 'Payé',
  failed: 'Échoué',
  refunded: 'Remboursé',
};
