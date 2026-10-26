import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CONDITION_LABELS, type Condition, type ProductView } from '@/data/products';
import { colors } from '@/theme/colors';
import { formatPrice } from '@/utils/format';

const BADGE: Record<Condition, { bg: string; dot: string }> = {
  reconditionne: { bg: '#1D4ED8', dot: '#FFFFFF' },
  neuf: { bg: colors.greenSoft, dot: colors.green },
  occasion: { bg: colors.orange, dot: '#FFFFFF' },
};

type Props = {
  product: ProductView;
  favorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
};

export function ProductCard({ product, favorite, onToggleFavorite, onAddToCart }: Props) {
  const badge = product.condition ? BADGE[product.condition] : undefined;
  const lightBadge = product.condition === 'neuf';

  return (
    <Pressable
      style={styles.card}
      disabled={!product.slug}
      onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: product.slug! } })}
      accessibilityRole="button"
      accessibilityLabel={product.name}>
      <View style={styles.imageWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} contentFit="contain" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name={product.icon} size={44} color="#94A3B8" />
          </View>
        )}
        {product.condition && badge ? (
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <View style={[styles.badgeDot, { backgroundColor: badge.dot }]} />
            <Text style={[styles.badgeText, lightBadge && { color: colors.green }]} numberOfLines={1}>
              {CONDITION_LABELS[product.condition]}
            </Text>
          </View>
        ) : null}
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? colors.danger : colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.brand ? (
          <Text style={styles.specs} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}

        <View style={styles.priceBlock}>
          {product.oldPrice ? (
            <Text style={styles.oldPrice}>{formatPrice(product.oldPrice)} FCFA</Text>
          ) : null}
          {product.price != null ? (
            <Text style={styles.price}>
              {formatPrice(product.price)} <Text style={styles.currency}>FCFA</Text>
            </Text>
          ) : (
            <Text style={styles.currency}>Prix sur demande</Text>
          )}
        </View>

        <Pressable
          onPress={onAddToCart}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityLabel={`Ajouter ${product.name} au panier`}>
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.ctaText}>Panier</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  imageWrap: { height: 168, backgroundColor: colors.imageBg, padding: 10 },
  image: { position: 'absolute', top: 42, bottom: 14, left: 10, right: 10, borderRadius: 6, backgroundColor: colors.imageBg },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2E8F0' },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    maxWidth: '78%',
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { color: '#fff', fontSize: 10.5, fontWeight: '700' },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 12, flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, minHeight: 36 },
  specs: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  priceBlock: { marginTop: 'auto', paddingTop: 10, minHeight: 56, justifyContent: 'flex-end' },
  oldPrice: { fontSize: 11, color: colors.strike, textDecorationLine: 'line-through' },
  price: { fontSize: 19, fontWeight: '800', color: colors.text },
  currency: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  cta: {
    marginTop: 10,
    height: 40,
    borderRadius: 6,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
