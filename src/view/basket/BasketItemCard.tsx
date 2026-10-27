import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGetProduct } from '@/api/product/products';
import { CONDITION_FROM_API, CONDITION_LABELS, coverPhotoUrl, resolveImage } from '@/data/products';
import { colors } from '@/theme/colors';
import type { BasketItem } from '@/types/basket';
import { useCurrency } from '@/providers/currency-provider';
import { formatPrice } from '@/utils/format';

import { QuantityStepper } from './QuantityStepper';

type Props = {
  item: BasketItem;
  onChangeQuantity: (item: BasketItem, quantity: number) => Promise<void>;
  onRemove: (item: BasketItem) => Promise<void>;
};

export function BasketItemCard({ item, onChangeQuantity, onRemove }: Props) {
  const { currency, format } = useCurrency();
  const [busy, setBusy] = useState(false);
  const { product } = item;
  // The basket only carries photo IRIs, so the cover comes from the full product (cached, shared with the product page).
  const { data: fullProduct } = useGetProduct(product.slug);
  const image = resolveImage(coverPhotoUrl(fullProduct?.photos));
  const unitPrice = item.priceAtAdd ?? product.actualPrice ?? 0;
  const oldPrice = product.previousPrice && product.previousPrice > unitPrice ? product.previousPrice : undefined;
  const condition = product.productCondition ? CONDITION_FROM_API[product.productCondition] : undefined;
  const unavailable = product.isAvailable === false;

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
      <View style={styles.main}>
        <Pressable onPress={openProduct} disabled={!product.slug} accessibilityRole="button" accessibilityLabel={product.title}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} contentFit="contain" />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Ionicons name="cube-outline" size={28} color={colors.strike} />
            </View>
          )}
          {item.variant ? (
            <View style={styles.variant}>
              <Text style={styles.variantText} numberOfLines={1}>
                {item.variant}
              </Text>
            </View>
          ) : null}
        </Pressable>

        <View style={styles.body}>
          <View style={styles.top}>
            <Pressable onPress={openProduct} disabled={!product.slug} style={styles.titleWrap}>
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
              <Ionicons name="close" size={18} color={colors.textMuted} />
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

          <View style={styles.bottom}>
            <View>
              {oldPrice ? <Text style={styles.oldPrice}>{format(oldPrice)}</Text> : null}
              <Text style={styles.price}>
                {formatPrice(unitPrice)} <Text style={styles.currency}>{currency}</Text>
              </Text>
            </View>
            <QuantityStepper value={item.quantity} disabled={busy} onChange={(q) => run(() => onChangeQuantity(item, q))} />
          </View>
        </View>
      </View>

      <View style={[styles.footer, unavailable && styles.footerWarn]}>
        <View style={styles.footerLeft}>
          <View style={[styles.dot, unavailable && styles.dotWarn]} />
          <Text style={[styles.footerText, unavailable && styles.footerTextWarn]}>
            {unavailable ? 'Actuellement indisponible' : 'Disponible'}
          </Text>
        </View>
        {busy ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : item.quantity > 1 ? (
          <Text style={styles.lineTotal}>Total : {format(unitPrice * item.quantity)}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  main: { flexDirection: 'row', gap: 16 },
  image: { width: 96, height: 96, borderRadius: 8, backgroundColor: colors.imageBg },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  variant: {
    position: 'absolute',
    top: 4,
    left: 4,
    maxWidth: 88,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.chipBg,
  },
  variantText: { fontSize: 10, fontWeight: '600', color: colors.text },
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
  bottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginTop: 'auto' },
  oldPrice: { fontSize: 11, color: colors.strike, textDecorationLine: 'line-through' },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  currency: { fontSize: 12 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  footerWarn: { backgroundColor: colors.orangeSoft },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  dotWarn: { backgroundColor: colors.orange },
  footerText: { fontSize: 11, color: colors.text },
  footerTextWarn: { color: colors.orange },
  lineTotal: { fontSize: 11, fontWeight: '600', color: colors.text },
});
