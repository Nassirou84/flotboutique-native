import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';

import { resolveImage, toProductView } from '@/data/products';
import { useBasket } from '@/providers/basket-provider';
import { useWishlist } from '@/providers/wishlist-provider';
import type { Product } from '@/types/product';

import { ProductBottomBar } from './ProductBottomBar';
import { ProductConditionCard } from './ProductConditionCard';
import { ProductGallery } from './ProductGallery';
import { ProductHeader } from './ProductHeader';
import { ProductInfoSections } from './ProductInfoSections';
import { ProductPriceCard } from './ProductPriceCard';
import { ProductTopBar } from './ProductTopBar';
import { ProductTrustCards } from './ProductTrustCards';
import { ProductVariantPicker } from './ProductVariantPicker';

/** The full product page for a loaded product: owns the selected variant and the basket/wishlist actions. */
export function ProductDetailView({ product }: { product: Product }) {
  const { addToBasket } = useBasket();
  const { wishlistMember, toggleWishlist } = useWishlist();
  const view = toProductView(product);

  const variants = product.actualVariants ?? [];
  const [variantId, setVariantId] = useState<string | undefined>(variants[0]?.id);
  const variant = variants.find((v) => v.id === variantId);

  const productPhotos = (product.photos ?? []).map((p) => resolveImage(p.url)).filter((u): u is string => !!u);
  const variantPhotos = variants.map((v) => resolveImage(v.image)).filter((u): u is string => !!u);
  const photos = [...new Set([...productPhotos, ...variantPhotos])];

  const price = variant?.actualPrice ?? product.actualPrice;
  const oldPrice = variant ? undefined : view.oldPrice;
  const unavailable = product.isAvailable === false;

  const addToCart = () => addToBasket(product.id, 1, variant?.id);
  const buyNow = async () => {
    await addToCart();
    router.navigate('/panier');
  };

  return (
    <View style={styles.flex}>
      <ProductTopBar onShare={() => Share.share({ message: view.name }).catch(() => {})} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProductHeader brand={product.brand} sku={product.uid} title={view.name} rating={product.overallRating} />
        <ProductGallery
          photos={photos}
          activePhoto={resolveImage(variant?.image)}
          favorite={wishlistMember.has(product.id)}
          onToggleFavorite={() => toggleWishlist({ id: product.id, '@id': product['@id'] })}
        />
        {variants.length > 0 ? (
          <ProductVariantPicker variants={variants} selectedId={variantId} onSelect={setVariantId} />
        ) : null}
        <ProductPriceCard price={price} oldPrice={oldPrice} available={!unavailable} />
        {view.condition ? <ProductConditionCard condition={view.condition} acceptReturn={product.acceptReturn} /> : null}
        <ProductTrustCards />
        <ProductInfoSections product={product} />
      </ScrollView>
      <ProductBottomBar price={price} disabled={unavailable} onAddToCart={addToCart} onBuyNow={buyNow} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 24, gap: 16 },
});
