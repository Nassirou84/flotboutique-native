import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PAYMENT_METHODS } from '@/view/checkout/constants';
import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';
import { formatPrice } from '@/utils/format';

type Props = { itemCount: number; total: number };

const availableMethods = PAYMENT_METHODS.filter((m) => m.available);

export function BasketRecap({ itemCount, total }: Props) {
  const { currency, format } = useCurrency();
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Récapitulatif de la commande</Text>

      <View style={styles.row}>
        <Text style={styles.label}>
          Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})
        </Text>
        <Text style={styles.value}>{format(total)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Livraison</Text>
        <Text style={styles.muted}>Calculée à la commande</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {formatPrice(total)} <Text style={styles.currency}>{currency}</Text>
        </Text>
      </View>

      <View style={styles.payments}>
        <Text style={styles.paymentsLabel}>Modes de paiement acceptés :</Text>
        <View style={styles.chips}>
          {availableMethods.map((m) => (
            <View key={m.id} style={styles.chip}>
              <Ionicons name={m.icon} size={13} color={colors.primary} />
              <Text style={styles.chipText}>{m.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  heading: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { flex: 1, fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, fontWeight: '500', color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 4 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  currency: { fontSize: 14, color: colors.text },
  payments: { gap: 6, padding: 8, marginTop: 4, borderRadius: 8, backgroundColor: colors.background },
  paymentsLabel: { fontSize: 11, fontWeight: '500', color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  chipText: { fontSize: 11, fontWeight: '600', color: colors.text },
});
