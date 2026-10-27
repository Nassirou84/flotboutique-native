import * as SecureStore from 'expo-secure-store';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Which notifications a user has read. The API has no notification feed (they are derived from orders,
 * offers and account state), so this is kept on the device, per user. Only the latest ids are kept to stay
 * well under the secure store's size limit.
 */
const MAX_IDS = 60;
const key = (userId: number) => `flot.notifications.read.${userId}`;

type State = { userId: number; ids: string[] };

let state: State = { userId: 0, ids: [] };
const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const load = async (userId: number) => {
  let ids: string[] = [];
  try {
    const stored = await SecureStore.getItemAsync(key(userId));
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    if (Array.isArray(parsed)) ids = parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    // Unreadable storage: start from "nothing read".
  }
  set({ userId, ids });
};

/** Marks notifications as read for `userId` and persists the list (best effort). */
export const markAsRead = async (userId: number, ids: string[]) => {
  if (!userId || state.userId !== userId) return;
  const next = [...state.ids.filter((id) => !ids.includes(id)), ...ids].slice(-MAX_IDS);
  set({ userId, ids: next });
  try {
    await SecureStore.setItemAsync(key(userId), JSON.stringify(next));
  } catch {
    // Not persisted: read for this session only.
  }
};

/** `loaded` is false until the stored ids are read, so nothing flashes as unread meanwhile. */
export function useReadIds(userId: number) {
  const current = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );

  useEffect(() => {
    if (userId && current.userId !== userId) load(userId);
  }, [userId, current.userId]);

  return { ids: current.userId === userId ? current.ids : [], loaded: !!userId && current.userId === userId };
}
