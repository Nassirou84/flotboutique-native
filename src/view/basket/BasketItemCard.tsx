import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGetProduct } from '@/api/product/products';
import { coverPhotoUrl, resolveImage } from '@/data/products';
import { colors } from '@/theme/colors';
import type { BasketItem } from '@/types/basket';
import { formatPrice } from '@/utils/format';

import { QuantityStepper } from './QuantityStepper';

type Props = {
  item: BasketItem;
  onChangeQuantity: (item: BasketItem, quantity: number) => Promise<void>;
  onRemove: (item: BasketItem) => Promise<void>;
};

export function BasketItemCard({ item, onChangeQuantity, onRemove }: Props) {
  const [busy, setBusy] = useState(false);
  const { product } = item;
  // The basket only carries photo IRIs, so the cover comes from the full product (cached, shared with the product page).
  const { data: fullProduct } = useGetProduct(product.slug);
  const image = resolveImage(coverPhotoUrl(fullProduct?.photos));
  const unitPrice = item.priceAtAdd ?? product.actualPrice ?? 0;

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const openProduct = () => {
    if (product.slug) router.push({ pathname: '/product/[slug]', params: { slug: product.slug } });
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={openProduct} disabled={!product.slug} accessibilityRole="button" accessibilityLabel={product.title}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} contentFit="contain" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="cube-outline" size={28} color="#94A3B8" />
          </View>
        )}
      </Pressable>

      <View style={styles.body}>
        <View style={styles.top}>
          <Pressable onPress={openProduct} disabled={!product.slug} style={styles.titleWrap}>
            {product.brand ? <Text style={styles.brand}>{product.brand.toUpperCase()}</Text> : null}
            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => run(() => onRemove(item))}
            disabled={busy}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Retirer du panier">
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>

        <Text style={styles.unit}>{formatPrice(unitPrice)} FCFA</Text>

        <View style={styles.bottom}>
          <QuantityStepper
            value={item.quantity}
            disabled={busy}
            onChange={(q) => run(() => onChangeQuantity(item, q))}
          />
          {busy ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.lineTotal}>{formatPrice(unitPrice * item.quantity)} F</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  image: { width: 88, height: 88, borderRadius: 10, backgroundColor: colors.surface },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.imageBg },
  body: { flex: 1, gap: 6 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  titleWrap: { flex: 1 },
  brand: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
  unit: { fontSize: 12.5, color: colors.textMuted },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  lineTotal: { fontSize: 16, fontWeight: '800', color: colors.text },
});
