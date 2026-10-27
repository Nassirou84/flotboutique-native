import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { OrderConfirmation } from '@/api/order/place-order';
import { colors } from '@/theme/colors';
import { useCurrency } from '@/providers/currency-provider';
import { AuthButton } from '@/view/auth';

import { SHIPPING_OPTIONS } from './constants';

type Props = { confirmation: OrderConfirmation; shippingOption: 'free' | 'express' };

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

// The API sends "Y-m-d H:i:s"; it is null for standard delivery, so fall back to the chosen delay.
const deliveryText = (confirmation: OrderConfirmation, shippingOption: Props['shippingOption']) => {
  if (confirmation.estimatedDeliveryAt) {
    const date = new Date(confirmation.estimatedDeliveryAt.replace(' ', 'T'));
    if (!Number.isNaN(date.getTime())) return DATE_FORMAT.format(date);
  }
  const delay = SHIPPING_OPTIONS.find((o) => o.id === shippingOption)?.delay;
  return delay ? `Sous ${delay}` : 'À confirmer';
};

function Line({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.lineText}>
        {label} : <Text style={styles.bold}>{value}</Text>
      </Text>
    </View>
  );
}

export function CheckoutSuccess({ confirmation, shippingOption }: Props) {
  const { format } = useCurrency();
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.badge}>
        <Ionicons name="checkmark" size={40} color={colors.green} />
      </View>
      <Text style={styles.title}>Merci pour votre commande !</Text>
      <Text style={styles.subtitle}>
        Nous l’avons bien reçue
        {confirmation.email ? (
          <>
            {' '}
            et envoyé un reçu de confirmation à <Text style={styles.bold}>{confirmation.email}</Text>
          </>
        ) : null}
        .
      </Text>

      <View style={styles.receipt}>
        <View style={styles.reference}>
          <Text style={styles.referenceLabel}>RÉFÉRENCE</Text>
          <Text style={styles.referenceValue} selectable>
            {confirmation.orderNumber ?? '—'}
          </Text>
        </View>
        <Line icon="calendar-outline" label="Livraison estimée" value={deliveryText(confirmation, shippingOption)} />
        {confirmation.fullAddress ? <Line icon="location-outline" label="Livré à" value={confirmation.fullAddress} /> : null}
        {confirmation.totalAmount != null ? (
          <Line icon="cash-outline" label="Total" value={`${format(confirmation.totalAmount)}`} />
        ) : null}
        {confirmation.items.length > 0 ? (
          <View style={styles.items}>
            {confirmation.items.map((item, index) => (
              <Text key={`${item.productName}-${index}`} style={styles.itemText} numberOfLines={2}>
                ×{item.quantity} {item.productName}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <AuthButton label="Voir mes commandes" icon="bus-outline" onPress={() => router.replace('/commandes')} />
      <Pressable onPress={() => router.replace('/catalogue')} style={styles.secondary} accessibilityRole="button">
        <Text style={styles.secondaryText}>Continuer mes achats</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 48, gap: 16 },
  badge: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
  },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: colors.text },
  subtitle: { fontSize: 14.5, lineHeight: 22, textAlign: 'center', color: colors.textMuted },
  bold: { fontWeight: '700', color: colors.text },
  receipt: { gap: 12, padding: 16, borderRadius: 12, backgroundColor: colors.surface },
  reference: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  referenceLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: colors.textMuted },
  referenceValue: { fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  lineText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  items: { gap: 4, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  itemText: { fontSize: 13.5, color: colors.text },
  secondary: { alignItems: 'center', paddingVertical: 8 },
  secondaryText: { fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
});
