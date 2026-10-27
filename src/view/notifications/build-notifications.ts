import { router } from 'expo-router';

import type { AvailableDiscount } from '@/api/order/get-available-discount';
import { OrderStatus, type Order } from '@/types/order';
import type { User } from '@/types/user';
import { formatLongDate } from '@/utils/format';

import type { AppNotification, NotificationSection } from './constants';
import type { IconName } from '@/view/orders/constants';

const DAY_MS = 24 * 60 * 60 * 1000;
const SOON_MS = 3 * DAY_MS;

const ORDER_EVENTS: Record<string, { icon: IconName; title: string; body: (product: string) => string }> = {
  [OrderStatus.PLACED]: {
    icon: 'receipt-outline',
    title: 'Commande confirmée',
    body: (p) => `Nous avons bien reçu votre commande de ${p}.`,
  },
  [OrderStatus.PROCESSING]: {
    icon: 'construct-outline',
    title: 'Commande en préparation',
    body: (p) => `${p} est en cours de préparation.`,
  },
  [OrderStatus.TRANSIT]: {
    icon: 'cube-outline',
    title: 'Commande expédiée',
    body: (p) => `${p} est en route vers vous.`,
  },
  [OrderStatus.ARRIVED_IN_FACILITY]: {
    icon: 'business-outline',
    title: 'Colis arrivé au dépôt',
    body: (p) => `${p} est arrivé au dépôt et sera bientôt livré.`,
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    icon: 'bicycle-outline',
    title: 'Livraison en cours',
    body: (p) => `Le livreur est en route avec ${p}.`,
  },
  [OrderStatus.DELIVERED]: {
    icon: 'checkmark-done-circle-outline',
    title: 'Commande livrée',
    body: (p) => `${p} a été livré. Merci pour votre confiance !`,
  },
  [OrderStatus.CANCELLED]: {
    icon: 'close-circle-outline',
    title: 'Commande annulée',
    body: (p) => `Votre commande de ${p} a été annulée.`,
  },
};

const productLabel = (order: Order) => {
  const [first] = order.products;
  const others = order.products.length - 1;
  const name = first?.product.title ?? 'votre commande';
  return others > 0 ? `${name} (+ ${others} autre${others > 1 ? 's' : ''})` : name;
};

/** One event per order: its current status, dated by the last status change. */
const orderNotifications = (orders: Order[]): Omit<AppNotification, 'unread'>[] =>
  orders.flatMap((order) => {
    const event = ORDER_EVENTS[order.status];
    if (!event) return [];
    const active = order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED;
    const eta = formatLongDate(order.estimatedDeliveryAt);
    return {
      id: `order:${order.id}:${order.status}`,
      kind: 'orders' as const,
      icon: event.icon,
      eyebrow: `Commande #${order.uid}`,
      title: event.title,
      body: event.body(productLabel(order)),
      date: new Date(order.updatedAt || order.createdAt),
      chips: active && eta ? [{ icon: 'time-outline' as const, label: 'Livraison estimée :', value: eta }] : undefined,
      action: {
        label: 'Voir la commande',
        onPress: () => router.push({ pathname: '/commande/[id]', params: { id: String(order.id) } }),
      },
    };
  });

const promoNotification = (promo: AvailableDiscount): Omit<AppNotification, 'unread'> => {
  const percent = Number(promo.discount);
  const expiresAt = promo.expiresAt ? new Date(promo.expiresAt) : null;
  const left = expiresAt ? expiresAt.getTime() - Date.now() : null;
  const expiry =
    left === null
      ? null
      : left <= SOON_MS
        ? { label: left < DAY_MS ? "Expire aujourd'hui" : `Expire dans ${Math.ceil(left / DAY_MS) * 24} h`, warn: true }
        : { label: `Expire le ${formatLongDate(promo.expiresAt ?? undefined)}`, warn: false };

  return {
    id: `promo:${promo.code}`,
    kind: 'promos',
    icon: 'flash-outline',
    eyebrow: 'Offre en cours • Flot Boutique',
    title: `${Number.isNaN(percent) ? promo.discount : percent} % de réduction sur votre commande`,
    body: 'Saisissez le code à la validation de votre commande pour en profiter.',
    chips: [{ label: 'Code :', value: promo.code }, ...(expiry ? [{ icon: 'timer-outline' as const, ...expiry }] : [])],
    action: { label: 'Voir le catalogue', onPress: () => router.navigate('/catalogue') },
  };
};

/** To-dos that disappear once done, so they never go stale. */
const accountNotifications = (user: User): Omit<AppNotification, 'unread'>[] => [
  ...(user.twoFactor
    ? []
    : [
        {
          id: 'tip:2fa',
          kind: 'account' as const,
          icon: 'shield-checkmark-outline' as const,
          eyebrow: 'Sécurité',
          title: 'Activez la double authentification',
          body: 'Un code à usage unique est demandé sur tout nouvel appareil : votre compte reste protégé même si votre mot de passe est connu.',
          action: { label: 'Activer', onPress: () => router.push('/double-authentification') },
        },
      ]),
  ...(user.phone
    ? []
    : [
        {
          id: 'tip:phone',
          kind: 'account' as const,
          icon: 'call-outline' as const,
          eyebrow: 'Compte',
          title: 'Ajoutez votre numéro de téléphone',
          body: 'Il servira à vous joindre pour la livraison de vos commandes.',
          action: { label: 'Ajouter', onPress: () => router.push('/modifier-telephone') },
        },
      ]),
  ...(user.addresses?.length
    ? []
    : [
        {
          id: 'tip:address',
          kind: 'account' as const,
          icon: 'location-outline' as const,
          eyebrow: 'Compte',
          title: 'Ajoutez une adresse de livraison',
          body: 'Enregistrez-la une fois pour commander plus vite.',
          action: { label: 'Ajouter', onPress: () => router.push('/adresses') },
        },
      ]),
];

export function buildNotifications({
  user,
  orders,
  promo,
  readIds,
  loaded,
}: {
  user: User | null;
  orders: Order[];
  promo: AvailableDiscount | null | undefined;
  readIds: string[];
  /** Until the stored read ids are loaded nothing is flagged unread. */
  loaded: boolean;
}): AppNotification[] {
  const all = [
    ...(promo ? [promoNotification(promo)] : []),
    ...(user ? accountNotifications(user) : []),
    ...orderNotifications(orders),
  ];
  const read = new Set(readIds);
  const items = all.map((n) => ({ ...n, unread: loaded && !read.has(n.id) }));

  // What is happening now first, then dated events, newest first.
  const time = (n: AppNotification) => n.date?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return items.sort((a, b) => time(b) - time(a));
}

/** "En ce moment" (undated), then Aujourd'hui, Cette semaine, Plus ancien. */
export function groupNotifications(items: AppNotification[], now = new Date()): NotificationSection[] {
  const sections: NotificationSection[] = [
    { key: 'now', title: 'En ce moment', items: [] },
    { key: 'today', title: "Aujourd'hui", items: [] },
    { key: 'week', title: 'Cette semaine', items: [] },
    { key: 'older', title: 'Plus ancien', items: [] },
  ];
  for (const item of items) {
    const section = !item.date
      ? sections[0]
      : item.date.toDateString() === now.toDateString()
        ? sections[1]
        : now.getTime() - item.date.getTime() < 7 * DAY_MS
          ? sections[2]
          : sections[3];
    section.items.push(item);
  }
  return sections.filter((s) => s.items.length > 0);
}
