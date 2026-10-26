import { StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import type { ProductView } from '@/data/products';
import { useBasket } from '@/providers/basket-provider';
import { useWishlist } from '@/providers/wishlist-provider';

/** A product card wired to the basket and the wishlist. */
export function HomeProductItem({ product }: { product: ProductView }) {
  const { addToBasket } = useBasket();
  const { wishlistMember, toggleWishlist } = useWishlist();

  return (
    <View style={styles.cell}>
      <ProductCard
        product={product}
        favorite={wishlistMember.has(product.id)}
        onToggleFavorite={() => toggleWishlist({ id: product.id, '@id': product.iri })}
        onAddToCart={() => addToBasket(product.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1 },
});
