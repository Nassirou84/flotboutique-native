import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';
import { AuthButton } from '@/view/auth';

import type { CheckoutStep } from './constants';

const CTA: Record<CheckoutStep, { label: string; icon: 'arrow-forward' | 'checkmark-circle-outline' }> = {
  1: { label: 'Continuer vers le paiement', icon: 'arrow-forward' },
  2: { label: 'Vérifier ma commande', icon: 'arrow-forward' },
  3: { label: 'Confirmer la commande', icon: 'checkmark-circle-outline' },
};

type Props = { step: CheckoutStep; total: number; loading: boolean; onPress: () => void };

/** Sticky bar: running total and the button that moves to the next step (or places the order). */
export function CheckoutFooter({ step, total, loading, onPress }: Props) {
  const { format } = useCurrency();
  const { bottom } = useSafeAreaInsets();
  const { label, icon } = CTA[step];

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottom, 12) }]}>
      <View style={styles.row}>
        <Text style={styles.label}>Total à payer</Text>
        <Text style={styles.total}>{format(total)}</Text>
      </View>
      <AuthButton label={label} icon={icon} iconRight loading={loading} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, color: colors.textMuted },
  total: { fontSize: 20, fontWeight: '800', color: colors.text },
});
