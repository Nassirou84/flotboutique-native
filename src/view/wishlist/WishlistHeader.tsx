import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function WishlistHeader({ count }: { count: number }) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.navigate('/compte'))}
        hitSlop={8}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Retour">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Mes favoris</Text>
      {count > 0 ? (
        <View style={styles.count}>
          <Text style={styles.countText}>
            {count} produit{count > 1 ? 's' : ''}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 56 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  count: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.chipBg },
  countText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
});
