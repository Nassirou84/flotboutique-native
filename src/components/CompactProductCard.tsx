import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CONDITION_LABELS, type Condition, type ProductView } from '@/data/products';
import { colors } from '@/theme/colors';
import { formatPrice } from '@/utils/format';

const BADGE: Record<Condition, { bg: string; fg: string }> = {
  reconditionne: { bg: '#E0E7FF', fg: '#3730A3' },
  neuf: { bg: '#DBEAFE', fg: '#1D4ED8' },
  occasion: { bg: '#FFEDD5', fg: colors.orange },
};

type Props = {
  product: ProductView;
  favorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
};

export function CompactProductCard({ product, favorite, onToggleFavorite, onAddToCart }: Props) {
  const badge = product.condition ? BADGE[product.condition] : undefined;

  return (
    <Pressable
      style={styles.card}
      disabled={!product.slug}
      onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: product.slug! } })}
      accessibilityRole="button"
      accessibilityLabel={product.name}>
      <View style={styles.imageWrap}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name={product.icon} size={40} color="#94A3B8" />
          </View>
        )}
        {product.condition && badge ? (
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.fg }]} numberOfLines={1}>
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
            size={17}
            color={favorite ? colors.danger : colors.text}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.brand ? (
          <Text style={styles.sub} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.priceCol}>
            {product.oldPrice ? (
              <Text style={styles.oldPrice}>{formatPrice(product.oldPrice)} F</Text>
            ) : null}
            {product.price != null ? (
              <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
                {formatPrice(product.price)} F
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={onAddToCart}
            style={({ pressed }) => [styles.cart, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel={`Ajouter ${product.name} au panier`}>
            <Ionicons name="cart" size={20} color="#fff" />
          </Pressable>
        </View>
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
  imageWrap: { padding: 8 },
  image: { height: 144, borderRadius: 8, width: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF1F8' },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    maxWidth: '70%',
  },
  badgeText: { fontSize: 10.5, fontWeight: '700' },
  heart: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 6, flex: 1 },
  name: { fontSize: 14.5, fontWeight: '700', color: colors.text, minHeight: 34 },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 10,
  },
  priceCol: { flex: 1, minHeight: 40, justifyContent: 'flex-end' },
  oldPrice: { fontSize: 11, color: colors.strike, textDecorationLine: 'line-through' },
  price: { fontSize: 19, fontWeight: '800', color: '#1D4ED8' },
  cart: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
