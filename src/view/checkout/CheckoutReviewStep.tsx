import { Pressable, StyleSheet, Text, View } from 'react-native';

import { variantLabel } from '@/data/products';
import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';

import { CheckoutCard } from './CheckoutCard';
import { paymentMethodTitle, SHIPPING_OPTIONS } from './constants';
import { CheckoutTotals } from './CheckoutTotals';
import { PromoCodeBox } from './PromoCodeBox';
import type { CheckoutState } from './use-checkout';

type Props = Pick<
  CheckoutState,
  | 'items'
  | 'address'
  | 'paymentMethod'
  | 'promo'
  | 'promoError'
  | 'checkingPromo'
  | 'applyPromo'
  | 'removePromo'
  | 'totals'
  | 'setStep'
>;

function EditLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button">
      <Text style={styles.edit}>Modifier</Text>
    </Pressable>
  );
}

export function CheckoutReviewStep({
  items,
  address,
  paymentMethod,
  promo,
  promoError,
  checkingPromo,
  applyPromo,
  removePromo,
  totals,
  setStep,
}: Props) {
  const { format } = useCurrency();
  const shipping = SHIPPING_OPTIONS.find((o) => o.id === address.shippingOption);

  return (
    <View style={styles.stack}>
      <CheckoutCard title="Livraison" right={<EditLink onPress={() => setStep(1)} />}>
        <Text style={styles.strong}>{address.fullName}</Text>
        <Text style={styles.text}>
          {address.street}
          {address.suite ? `, ${address.suite}` : ''}
          {'\n'}
          {address.city}, {address.state}
        </Text>
        <Text style={styles.text}>
          {address.phone} • {address.email}
        </Text>
        {shipping ? (
          <Text style={styles.muted}>
            {shipping.title} ({shipping.delay})
          </Text>
        ) : null}
      </CheckoutCard>

      <CheckoutCard title="Paiement" right={<EditLink onPress={() => setStep(2)} />}>
        <Text style={styles.strong}>{paymentMethodTitle(paymentMethod)}</Text>
        {paymentMethod === 'cod' ? <Text style={styles.muted}>Prévoyez le montant exact en espèces.</Text> : null}
      </CheckoutCard>

      <CheckoutCard title={`Articles (${items.length})`}>
        <View style={styles.items}>
          {items.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemQty}>×{item.quantity}</Text>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.product.title}
                </Text>
                {variantLabel(item.variant) ? <Text style={styles.muted}>{variantLabel(item.variant)}</Text> : null}
              </View>
              <Text style={styles.itemPrice}>
                {format((item.product.actualPrice ?? item.priceAtAdd ?? 0) * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
      </CheckoutCard>

      <CheckoutCard title="Code promo">
        <PromoCodeBox
          promo={promo}
          promoError={promoError}
          checkingPromo={checkingPromo}
          applyPromo={applyPromo}
          removePromo={removePromo}
        />
      </CheckoutCard>

      <CheckoutCard title="Récapitulatif">
        <CheckoutTotals {...totals} />
      </CheckoutCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  edit: { fontSize: 13, fontWeight: '800', color: '#1D4ED8' },
  strong: { fontSize: 15, fontWeight: '700', color: colors.text },
  text: { fontSize: 14, lineHeight: 20, color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
  items: { gap: 12 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  itemQty: { minWidth: 28, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  itemText: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemPrice: { fontSize: 14, fontWeight: '700', color: colors.text },
});
