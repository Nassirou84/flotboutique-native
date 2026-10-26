import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import { formatPrice } from '@/utils/format';

type Props = { itemCount: number; total: number; onCheckout: () => void };

export function BasketSummary({ itemCount, total, onCheckout }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        <Text style={styles.label}>
          Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})
        </Text>
        <Text style={styles.total}>{formatPrice(total)} FCFA</Text>
      </View>
      <Text style={styles.note}>Livraison calculée à la commande. Paiement à la réception ou via Wave / Orange Money.</Text>
      <Pressable
        onPress={onCheckout}
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
        accessibilityRole="button">
        <Text style={styles.ctaText}>Passer la commande</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 8,
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { flex: 1, fontSize: 14, color: colors.textMuted },
  total: { fontSize: 22, fontWeight: '800', color: colors.text },
  note: { fontSize: 12, color: colors.textMuted },
  cta: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
