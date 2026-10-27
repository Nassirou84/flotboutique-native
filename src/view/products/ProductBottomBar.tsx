import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

type Props = { price?: number; disabled?: boolean; onAddToCart: () => void; onBuyNow: () => void };

export function ProductBottomBar({ price, disabled, onAddToCart, onBuyNow }: Props) {
  const { formatCompact } = useCurrency();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Pressable
        onPress={onAddToCart}
        style={styles.cart}
        accessibilityRole="button"
        accessibilityLabel="Ajouter au panier">
        <Ionicons name="cart-outline" size={24} color={colors.text} />
      </Pressable>
      <Pressable
        onPress={onBuyNow}
        disabled={disabled}
        style={({ pressed }) => [styles.buy, (pressed || disabled) && { opacity: 0.8 }]}
        accessibilityRole="button">
        <Text style={styles.buyText} numberOfLines={1}>
          Acheter maintenant{price != null ? ` • ${formatCompact(price)}` : ''}
        </Text>
        <View style={styles.pay}>
          <Ionicons name="wallet-outline" size={14} color="#fff" />
          <Text style={styles.payText}>Wave / OM</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cart: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  buy: {
    flex: 1,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
  },
  buyText: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  payText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
