import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import {
  useAddToWishlist,
  useGetUserWishlist,
  useRemoveFromWishlist,
  useRemoveProductFromWishlist,
} from '@/api/wishlist/wishlist';
import { useAuth } from '@/auth/auth-provider';
import type { Product } from '@/types/product';
import type { WishlistItem } from '@/types/wishlist';
import { getErrorMessage } from '@/utils/errors';
import { notifyError, notifySignIn } from '@/utils/notify';

type Action =
  | { type: 'ADD'; item: WishlistItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'REMOVE_PRODUCT'; productId: number }
  | { type: 'SET'; items: WishlistItem[] };

const reducer = (state: WishlistItem[], action: Action): WishlistItem[] => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.item];
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'REMOVE_PRODUCT':
      return state.filter((i) => i.product.id !== action.productId);
    case 'SET':
      return action.items;
  }
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  wishlistCount: number;
  /** IDs of wishlisted products, for O(1) "is this a favorite?" checks. */
  wishlistMember: Set<number>;
  /** Adds the product, or removes it if already wishlisted. Prompts to sign in when signed out. */
  toggleWishlist: (product: Pick<Product, 'id' | '@id'>) => Promise<void>;
  removeFromWishlist: (item: WishlistItem) => Promise<void>;
  /** True until the first fetch settles for a signed-in user. */
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, authenticated } = useAuth();
  const [items, dispatch] = useReducer(reducer, []);

  const { data, isLoading, isError, refetch } = useGetUserWishlist(user?.id ?? 0);
  const { mutateAsync: addItem } = useAddToWishlist();
  const { mutateAsync: removeItem } = useRemoveFromWishlist();
  const { mutateAsync: removeProduct } = useRemoveProductFromWishlist();

  useEffect(() => {
    if (!user) dispatch({ type: 'SET', items: [] });
    else if (!isLoading && !isError && data) dispatch({ type: 'SET', items: data.member ?? [] });
  }, [user, data, isLoading, isError]);

  const wishlistMember = useMemo(() => new Set(items.map((i) => i.product.id)), [items]);

  const toggleWishlist = useCallback<WishlistContextType['toggleWishlist']>(
    async (product) => {
      if (!authenticated) {
        notifySignIn('Connectez-vous pour ajouter un produit à votre liste de souhaits.', 'Liste de souhaits');
        return;
      }
      try {
        if (wishlistMember.has(product.id)) {
          await removeProduct(product.id);
          dispatch({ type: 'REMOVE_PRODUCT', productId: product.id });
        } else {
          dispatch({ type: 'ADD', item: await addItem(product['@id']) });
        }
      } catch (error) {
        notifyError(getErrorMessage(error, 'Impossible de mettre à jour la liste de souhaits.'));
      }
    },
    [authenticated, wishlistMember, addItem, removeProduct],
  );

  const removeFromWishlist = useCallback<WishlistContextType['removeFromWishlist']>(
    async (item) => {
      try {
        await removeItem(item.id);
        dispatch({ type: 'REMOVE', id: item.id });
      } catch (error) {
        notifyError(getErrorMessage(error, "Impossible de supprimer l'article."));
      }
    },
    [removeItem],
  );

  const refresh = useCallback(async () => {
    if (user) await refetch();
  }, [user, refetch]);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlist: items,
      wishlistCount: items.length,
      wishlistMember,
      toggleWishlist,
      removeFromWishlist,
      isLoading: !!user && isLoading,
      refresh,
    }),
    [items, wishlistMember, toggleWishlist, removeFromWishlist, user, isLoading, refresh],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
