import { useMemo, useState } from 'react';

import { useGetAvailableDiscount } from '@/api/order/get-available-discount';
import { useUserOrders } from '@/api/order/orders';
import { useAuth } from '@/auth/auth-provider';

import { buildNotifications, groupNotifications } from './build-notifications';
import type { NotificationFilter } from './constants';
import { markAsRead, useReadIds } from './read-store';

/** Notifications derived from the user's orders, the running offer and the state of their account. */
export function useNotifications() {
  const { user } = useAuth();
  const userId = user?.id ?? 0;

  const orders = useUserOrders({ userId, page: 1 });
  const promo = useGetAvailableDiscount();
  const { ids, loaded } = useReadIds(userId);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const items = useMemo(
    () => buildNotifications({ user, orders: orders.data ?? [], promo: promo.data, readIds: ids, loaded }),
    [user, orders.data, promo.data, ids, loaded],
  );

  const unread = items.filter((n) => n.unread);
  const visible = filter === 'all' ? items : items.filter((n) => n.kind === filter);

  return {
    user,
    filter,
    setFilter,
    items,
    sections: useMemo(() => groupNotifications(visible), [visible]),
    unreadCount: unread.length,
    /** Unread count per filter, for the chips. */
    unreadBy: (key: NotificationFilter) =>
      key === 'all' ? unread.length : unread.filter((n) => n.kind === key).length,
    markRead: (id: string) => markAsRead(userId, [id]),
    markAllRead: () =>
      markAsRead(
        userId,
        unread.map((n) => n.id),
      ),
    isLoading: orders.isLoading || promo.isLoading,
    refetch: () => Promise.all([orders.refetch(), promo.refetch()]),
  };
}
