import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

type Props = { total: number; onCheckout: () => void };

export function BasketSummary({ total, onCheckout }: Props) {
  const { format } = useCurrency();
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onCheckout}
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel={`Passer la commande, ${format(total)}`}>
        <View style={styles.side}>
          <Ionicons name="lock-closed" size={18} color="#fff" />
          <Text style={styles.ctaText}>Passer la commande</Text>
        </View>
        <View style={styles.side}>
          <Text style={styles.ctaText}>{format(total)}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </View>
      </Pressable>
      <View style={styles.reassurance}>
        <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
        <Text style={styles.reassuranceText}>Paiement sécurisé • Contrôle du colis avant règlement</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cta: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  reassurance: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  reassuranceText: { fontSize: 11, color: colors.textMuted },
});
