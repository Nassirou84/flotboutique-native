import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';

import {
  useAddToBasket,
  useClearBasket,
  useGetGuestBasket,
  useGetUserBasket,
  useMergeGuestBasket,
  useRemoveFromBasket,
  useUpdateBasketQuantity,
} from '@/api/basket/basket';
import { useAuth } from '@/auth/auth-provider';
import type { Basket, BasketItem } from '@/types/basket';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySuccess } from '@/utils/notify';

type Action =
  | { type: 'ADD'; item: BasketItem }
  | { type: 'REMOVE'; basketItemId: number }
  | { type: 'CLEAR' }
  | { type: 'UPDATE_QUANTITY'; basketItemId: number; quantity: number }
  | { type: 'SET'; basket: Basket | null };

const reducer = (state: Basket | null, action: Action): Basket | null => {
  switch (action.type) {
    case 'ADD':
      // A refetch can land before this dispatch and already contain the item, so upsert by id.
      return (
        state && {
          ...state,
          basketItems: state.basketItems.some((i) => i.id === action.item.id)
            ? state.basketItems.map((i) => (i.id === action.item.id ? action.item : i))
            : [...state.basketItems, action.item],
        }
      );
    case 'UPDATE_QUANTITY':
      return (
        state && {
          ...state,
          basketItems: state.basketItems.map((i) =>
            i.id === action.basketItemId ? { ...i, quantity: action.quantity } : i,
          ),
        }
      );
    case 'REMOVE':
      return state && { ...state, basketItems: state.basketItems.filter((i) => i.id !== action.basketItemId) };
    case 'CLEAR':
      return null;
    case 'SET':
      return action.basket;
  }
};

type BasketContextType = {
  basket: Basket | null;
  items: BasketItem[];
  basketCount: number;
  isHydrated: boolean;
  /** Resolves to whether the product ended up added (false when already in the basket or on error). */
  addToBasket: (productId: number, quantity?: number, variant?: string) => Promise<boolean>;
  removeFromBasket: (basketItemId: number) => Promise<void>;
  updateQuantity: (basketItemId: number, quantity: number) => Promise<void>;
  clearBasket: () => Promise<void>;
  /** Reloads the basket from the server (the guest basket when signed out). */
  refresh: () => Promise<void>;
};

const BasketContext = createContext<BasketContextType | null>(null);

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used within BasketProvider');
  return ctx;
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [basket, dispatch] = useReducer(reducer, null);
  const isMerging = useRef(false);

  const { data: userBasket, isLoading, isError, refetch: refetchUserBasket } = useGetUserBasket(user?.id ?? 0);
  const { data: guestBasket, isLoading: isGuestLoading, refetch: refetchGuestBasket } = useGetGuestBasket();

  const { mutateAsync: add } = useAddToBasket();
  const { mutateAsync: remove } = useRemoveFromBasket();
  const { mutateAsync: update } = useUpdateBasketQuantity();
  const { mutateAsync: clear } = useClearBasket();
  const { mutateAsync: mergeGuestBasket } = useMergeGuestBasket();

  // Keep local state in sync with the server basket (guest basket when signed out).
  useEffect(() => {
    if (!user) {
      if (!isGuestLoading) dispatch({ type: 'SET', basket: guestBasket || null });
      return;
    }
    const hasPendingGuestItems = guestBasket?.basketItems?.length > 0;
    if (!isLoading && !isError && userBasket && !hasPendingGuestItems) {
      dispatch({ type: 'SET', basket: userBasket });
    }
  }, [user, userBasket, guestBasket, isLoading, isError, isGuestLoading]);

  // After signing in, merge anything added as a guest into the user's basket.
  useEffect(() => {
    if (!user) {
      isMerging.current = false;
      return;
    }
    if (isGuestLoading || isMerging.current || !(guestBasket?.basketItems?.length > 0)) return;

    isMerging.current = true;
    mergeGuestBasket()
      .then(async (data) => {
        dispatch({ type: 'SET', basket: data.basket });
        await Promise.all([refetchGuestBasket(), refetchUserBasket()]);
      })
      .catch((error) => notifyError(getErrorMessage(error, 'Impossible de fusionner votre panier invité.')))
      .finally(() => {
        isMerging.current = false;
      });
  }, [user, guestBasket, isGuestLoading, mergeGuestBasket, refetchGuestBasket, refetchUserBasket]);

  const refreshGuest = useCallback(() => {
    if (!user) refetchGuestBasket();
  }, [user, refetchGuestBasket]);

  const addToBasket = useCallback<BasketContextType['addToBasket']>(
    async (productId, quantity = 1, variant) => {
      if (basket?.basketItems.some((i) => i.product.id === productId && i.variant === variant)) {
        notifyError('Ce produit est déjà dans votre panier.', 'Panier');
        return false;
      }
      try {
        const item = await add({ productId, quantity, variant });
        dispatch({ type: 'ADD', item });
        notifySuccess('Produit ajouté au panier', 'Le produit a été ajouté avec succès.');
        refreshGuest();
        return true;
      } catch (error) {
        notifyError(getErrorMessage(error, "Impossible d'ajouter le produit au panier."));
        return false;
      }
    },
    [basket, add, refreshGuest],
  );

  const removeFromBasket = useCallback<BasketContextType['removeFromBasket']>(
    async (basketItemId) => {
      try {
        await remove({ productId: basketItemId });
        dispatch({ type: 'REMOVE', basketItemId });
        refreshGuest();
      } catch (error) {
        notifyError(getErrorMessage(error, 'Impossible de supprimer le produit du panier.'));
      }
    },
    [remove, refreshGuest],
  );

  const updateQuantity = useCallback<BasketContextType['updateQuantity']>(
    async (basketItemId, quantity) => {
      try {
        const newQuantity = await update({ productId: basketItemId, quantity });
        dispatch({ type: 'UPDATE_QUANTITY', basketItemId, quantity: newQuantity });
        refreshGuest();
      } catch (error) {
        notifyError(getErrorMessage(error, 'Impossible de mettre à jour la quantité.'));
      }
    },
    [update, refreshGuest],
  );

  const clearBasket = useCallback(async () => {
    try {
      await clear();
      dispatch({ type: 'CLEAR' });
      refreshGuest();
    } catch (error) {
      notifyError(getErrorMessage(error, 'Impossible de vider le panier.'));
    }
  }, [clear, refreshGuest]);

  const refresh = useCallback(async () => {
    await (user ? refetchUserBasket() : refetchGuestBasket());
  }, [user, refetchUserBasket, refetchGuestBasket]);

  const value = useMemo<BasketContextType>(
    () => ({
      basket,
      items: basket?.basketItems ?? [],
      basketCount: basket?.basketItems.length ?? 0,
      isHydrated: !isLoading && !isError,
      addToBasket,
      removeFromBasket,
      updateQuantity,
      clearBasket,
      refresh,
    }),
    [basket, isLoading, isError, addToBasket, removeFromBasket, updateQuantity, clearBasket, refresh],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}
