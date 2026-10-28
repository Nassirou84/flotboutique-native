import { StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import type { ProductView } from '@/data/products';
import { useWishlist } from '@/providers/wishlist-provider';

/** One grid cell: a product card wired to the wishlist. */
export function CatalogueProductItem({ product }: { product: ProductView }) {
  const { wishlistMember, toggleWishlist } = useWishlist();

  return (
    <View style={styles.cell}>
      <ProductCard
        product={product}
        favorite={wishlistMember.has(product.id)}
        onToggleFavorite={() => toggleWishlist({ id: product.id, '@id': product.iri })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, padding: 8 },
});
