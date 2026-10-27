import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { PaymentMethod } from '@/types/payment-method';

import { brandLabel, MOBILE_COUNTRY_CODE, providerLabel } from './constants';

type Props = {
  method: PaymentMethod;
  onEdit: () => void;
  onRemove: () => void;
  onSetDefault: () => void;
};

export function PaymentMethodCard({ method, onEdit, onRemove, onSetDefault }: Props) {
  const isCard = method.method === 'card';
  const last4 = method.lastFourDigits ?? '••••';

  return (
    <View style={[styles.card, method.isDefault && styles.cardDefault]}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Ionicons name={isCard ? 'card-outline' : 'phone-portrait-outline'} size={22} color={colors.primary} />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{isCard ? brandLabel(method.cardBrand) : providerLabel(method.mobileProvider)}</Text>
            {method.isDefault ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Par défaut</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.number}>
            {isCard ? `•••• •••• •••• ${last4}` : `${MOBILE_COUNTRY_CODE} ••••••${last4}`}
          </Text>
          {method.cardHolderName ? <Text style={styles.holder}>{method.cardHolderName}</Text> : null}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {method.isDefault ? null : (
            <Pressable onPress={onSetDefault} hitSlop={8} accessibilityRole="button">
              <Text style={styles.setDefault}>Définir par défaut</Text>
            </Pressable>
          )}
          <Text style={styles.meta}>{isCard ? (method.expiry ? `Expire le ${method.expiry}` : '') : 'Compte actif'}</Text>
        </View>

        <View style={styles.actions}>
          {isCard ? (
            <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button" accessibilityLabel="Modifier la carte">
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </Pressable>
          ) : null}
          <Pressable onPress={onRemove} hitSlop={8} accessibilityRole="button" accessibilityLabel="Supprimer">
            <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDefault: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  top: { flexDirection: 'row', gap: 12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.primary },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  number: { fontSize: 15, letterSpacing: 1, color: colors.text, marginTop: 2 },
  holder: { fontSize: 12.5, color: colors.textMuted },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  meta: { fontSize: 12, color: colors.textMuted },
  setDefault: { fontSize: 12, fontWeight: '600', color: colors.primary },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
