import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGetProduct } from '@/api/product/products';
import { CONDITION_FROM_API, CONDITION_LABELS, coverPhotoUrl, resolveImage } from '@/data/products';
import { useBasket } from '@/providers/basket-provider';
import { colors } from '@/theme/colors';
import type { WishlistItem } from '@/types/wishlist';
import { useCurrency } from '@/providers/currency-provider';
import { formatPrice } from '@/utils/format';

type Props = { item: WishlistItem; onRemove: (item: WishlistItem) => Promise<void> };

export function WishlistItemCard({ item, onRemove }: Props) {
  const { currency, format } = useCurrency();
  const { addToBasket, items: basketItems } = useBasket();
  const [busy, setBusy] = useState(false);
  const { product } = item;
  // The wishlist only carries photo IRIs, so the cover comes from the full product (cached, shared with the product page).
  const { data: fullProduct } = useGetProduct(product.slug);
  const image = resolveImage(coverPhotoUrl(fullProduct?.photos));

  const price = product.actualPrice ?? item.priceAtAdd ?? 0;
  const oldPrice = product.previousPrice && product.previousPrice > price ? product.previousPrice : undefined;
  // Price drop since the product was saved.
  const drop = item.priceAtAdd && price > 0 && price < item.priceAtAdd ? item.priceAtAdd - price : 0;
  const condition = product.productCondition ? CONDITION_FROM_API[product.productCondition] : undefined;
  const unavailable = product.isAvailable === false;
  // Variants are chosen on the product page, so those products can't be added straight from here.
  const needsVariant = Object.keys(item.variant ?? {}).length > 0;
  const inBasket = basketItems.some((i) => i.product.id === product.id);

  const openProduct = () => {
    if (product.slug) router.push({ pathname: '/product/[slug]', params: { slug: product.slug } });
  };

  const remove = async () => {
    setBusy(true);
    try {
      await onRemove(item);
    } finally {
      setBusy(false);
    }
  };

  // Moves the product: it leaves the wishlist only once it is in the basket, so a failed add loses nothing.
  const moveToBasket = async () => {
    setBusy(true);
    try {
      if (await addToBasket(product.id, 1)) await onRemove(item);
    } finally {
      setBusy(false);
    }
  };

  const action = needsVariant
    ? { label: 'Choisir une option', onPress: openProduct }
    : inBasket
      ? { label: 'Voir le panier', onPress: () => router.navigate('/panier') }
      : { label: 'Déplacer vers le panier', onPress: moveToBasket };

  return (
    <View style={styles.card}>
      <View style={styles.main}>
        <Pressable onPress={openProduct} disabled={!product.slug} accessibilityRole="button" accessibilityLabel={product.title}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} contentFit="contain" />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Ionicons name="cube-outline" size={28} color={colors.strike} />
            </View>
          )}
        </Pressable>

        <View style={styles.body}>
          <View style={styles.top}>
            <Pressable onPress={openProduct} disabled={!product.slug} style={styles.titleWrap}>
              <Text style={styles.title} numberOfLines={2}>
                {product.title}
              </Text>
            </Pressable>
            <Pressable
              onPress={remove}
              disabled={busy}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Retirer des favoris">
              <Ionicons name="heart" size={20} color={colors.danger} />
            </Pressable>
          </View>

          {condition || product.brand ? (
            <View style={styles.tags}>
              {condition ? (
                <View style={styles.condition}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                  <Text style={styles.conditionText}>{CONDITION_LABELS[condition]}</Text>
                </View>
              ) : null}
              {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
            </View>
          ) : null}

          <View style={styles.priceBlock}>
            {oldPrice ? <Text style={styles.oldPrice}>{format(oldPrice)}</Text> : null}
            <Text style={styles.price}>
              {formatPrice(price)} <Text style={styles.currency}>{currency}</Text>
            </Text>
          </View>
        </View>
      </View>

      {drop > 0 ? (
        <View style={styles.drop}>
          <Ionicons name="trending-down" size={14} color={colors.green} />
          <Text style={styles.dropText}>Prix en baisse de {format(drop)} depuis votre ajout</Text>
        </View>
      ) : null}

      {unavailable ? (
        <View style={styles.unavailable}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.orange} />
          <Text style={styles.unavailableText}>Actuellement indisponible</Text>
        </View>
      ) : (
        <Pressable
          onPress={action.onPress}
          disabled={busy}
          style={({ pressed }) => [styles.cta, inBasket && !needsVariant && styles.ctaSecondary, pressed && { opacity: 0.85 }]}
          accessibilityRole="button">
          {busy ? (
            <ActivityIndicator size="small" color={inBasket && !needsVariant ? colors.primary : '#fff'} />
          ) : (
            <Text style={[styles.ctaText, inBasket && !needsVariant && styles.ctaTextSecondary]}>{action.label}</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  main: { flexDirection: 'row', gap: 16 },
  image: { width: 96, height: 96, borderRadius: 8, backgroundColor: colors.imageBg },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 6 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  titleWrap: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', lineHeight: 20, color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  condition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  conditionText: { fontSize: 11, fontWeight: '500', color: colors.primary },
  brand: { fontSize: 11, color: colors.textMuted },
  priceBlock: { marginTop: 'auto' },
  oldPrice: { fontSize: 11, color: colors.strike, textDecorationLine: 'line-through' },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  currency: { fontSize: 12 },
  drop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.greenSoft,
  },
  dropText: { flex: 1, fontSize: 11, fontWeight: '500', color: colors.green },
  unavailable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.orangeSoft,
  },
  unavailableText: { fontSize: 12, fontWeight: '500', color: colors.orange },
  cta: { height: 44, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  ctaSecondary: { backgroundColor: colors.primarySoft },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  ctaTextSecondary: { color: colors.primary },
});
