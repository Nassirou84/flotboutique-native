import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBasket } from '@/providers/basket-provider';
import { useWishlist } from '@/providers/wishlist-provider';
import { colors } from '@/theme/colors';
import type { IconName } from '@/view/orders/constants';

type Shortcut = { key: string; icon: IconName; label: string; count?: number; onPress: () => void };

export function AccountShortcuts() {
  const { wishlistCount } = useWishlist();
  const { basketCount } = useBasket();

  const shortcuts: Shortcut[] = [
    { key: 'orders', icon: 'bus-outline', label: 'Commandes', onPress: () => router.navigate('/commandes') },
    { key: 'wishlist', icon: 'heart-outline', label: 'Favoris', count: wishlistCount, onPress: () => router.navigate('/favoris') },
    { key: 'basket', icon: 'bag-outline', label: 'Panier', count: basketCount, onPress: () => router.navigate('/panier') },
  ];

  return (
    <View style={styles.row}>
      {shortcuts.map(({ key, icon, label, count, onPress }) => (
        <Pressable
          key={key}
          onPress={onPress}
          style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityLabel={count ? `${label}, ${count}` : label}>
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={22} color={colors.primary} />
            {count ? (
              <View style={styles.count}>
                <Text style={styles.countText}>{count > 99 ? '99+' : count}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginHorizontal: 16, marginTop: 12, flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
});
