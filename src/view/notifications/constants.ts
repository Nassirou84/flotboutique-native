import type { IconName } from '@/view/orders/constants';

export type NotificationKind = 'orders' | 'promos' | 'account';
export type NotificationFilter = 'all' | NotificationKind;

export type NotificationChip = { icon?: IconName; label: string; value?: string; warn?: boolean };

export type AppNotification = {
  /** Stable across refetches; a new order status gives a new id, so it shows up as unread again. */
  id: string;
  kind: NotificationKind;
  icon: IconName;
  eyebrow: string;
  title: string;
  body: string;
  /** Absent for what is happening now (running offer, account to-dos): those are not dated events. */
  date?: Date;
  chips?: NotificationChip[];
  action?: { label: string; onPress: () => void };
  unread: boolean;
};

export const FILTERS: { key: NotificationFilter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'orders', label: 'Commandes & Suivi' },
  { key: 'promos', label: 'Promotions & Offres' },
  { key: 'account', label: 'Compte & Sécurité' },
];

/** Icon background and accent colour of each kind of notification. */
export const KIND_TONES: Record<NotificationKind, { background: string; color: string }> = {
  orders: { background: '#DBE1FF', color: '#1D4ED8' },
  promos: { background: '#FFDBCD', color: '#943700' },
  account: { background: '#E5EEFF', color: '#434655' },
};

export type NotificationSection = { key: string; title: string; items: AppNotification[] };
