import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { CheckoutCard } from './CheckoutCard';
import { PAYMENT_METHODS } from './constants';
import { SelectableRow } from './SelectableRow';
import type { CheckoutState } from './use-checkout';

type Props = Pick<CheckoutState, 'paymentMethod' | 'setPaymentMethod'>;

export function CheckoutPaymentStep({ paymentMethod, setPaymentMethod }: Props) {
  return (
    <CheckoutCard title="Moyen de paiement" subtitle="Choisissez comment vous souhaitez régler votre commande.">
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Le paiement en ligne n’est pas encore disponible : réglez en espèces à la livraison pour finaliser votre commande.
        </Text>
      </View>
      <View style={styles.options}>
        {PAYMENT_METHODS.map((method) => (
          <SelectableRow
            key={method.id}
            icon={method.icon}
            title={method.title}
            description={method.description}
            selected={paymentMethod === method.id}
            disabled={!method.available}
            onPress={() => setPaymentMethod(method.id)}
            trailing={method.available ? undefined : <Text style={styles.soon}>Bientôt</Text>}
          />
        ))}
      </View>
    </CheckoutCard>
  );
}

const styles = StyleSheet.create({
  notice: { padding: 12, borderRadius: 8, backgroundColor: colors.orangeSoft },
  noticeText: { fontSize: 13, lineHeight: 19, color: colors.orange },
  options: { gap: 10 },
  soon: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.chipBg,
  },
});
