import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { SORT_LABELS, type Sort } from './constants';

type Props = { count: number; sort: Sort; onCycleSort: () => void };

export function CatalogueResultsBar({ count, sort, onCycleSort }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.count}>
        <Text style={styles.countNumber}>{count}</Text> produits certifiés
      </Text>
      <Pressable onPress={onCycleSort} style={styles.sort} accessibilityRole="button">
        <Text style={styles.sortText}>Trier : {SORT_LABELS[sort]}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  count: { fontSize: 15, color: colors.textMuted },
  countNumber: { fontSize: 22, fontWeight: '800', color: colors.text },
  sort: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { fontSize: 13.5, color: colors.textMuted },
});
