import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { count: number; onClear?: () => void };

export function BasketHeader({ count, onClear }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Panier</Text>
        {count > 0 ? (
          <View style={styles.count}>
            <Text style={styles.countText}>
              {count} article{count > 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}
      </View>
      {onClear ? (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          style={styles.clear}
          accessibilityRole="button"
          accessibilityLabel="Vider le panier">
          <Ionicons name="trash-outline" size={22} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  count: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.chipBg },
  countText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  clear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
});
