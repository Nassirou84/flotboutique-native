import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { CONDITION_LABELS, type Condition } from '@/data/products';
import { colors } from '@/theme/colors';

type Props = { condition: Condition; acceptReturn?: boolean };

export function ProductConditionCard({ condition, acceptReturn }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>ÉTAT CERTIFIÉ</Text>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{CONDITION_LABELS[condition]}</Text>
      </View>
      {acceptReturn ? (
        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.rowText}>Retour accepté</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft, borderRadius: 12, marginHorizontal: 16, padding: 16, gap: 10 },
  label: { fontSize: 14, fontWeight: '800', color: colors.text },
  pill: { alignSelf: 'flex-start', backgroundColor: '#1D4ED8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  pillText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowText: { flex: 1, fontSize: 14, color: colors.text },
});
