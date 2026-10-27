import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { formatDeliveryWindow } from '@/utils/format';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TRUST: { icon: IconName; bg: string; title: string; text: ReactNode }[] = [
  {
    icon: 'rocket-outline',
    bg: '#1D4ED8',
    title: 'Livraison estimée',
    text: '',
  },
  {
    icon: 'cash-outline',
    bg: '#475569',
    title: 'Paiement 100% Sécurisé',
    text: 'Payez à la réception après contrôle, ou en ligne via Orange Money, Wave, Djamo, Visa et Mastercard.',
  },
];

const RETURN: (typeof TRUST)[number] = {
  icon: 'refresh-outline',
  bg: colors.green,
  title: 'Retour accepté',
  text: 'Cet article peut être retourné sous 10 jours s’il ne vous convient pas.',
};

export function ProductTrustCards({ acceptReturn }: { acceptReturn?: boolean }) {
  // Computed per render so the window always starts from today.
  const { start, end } = formatDeliveryWindow(14, 18);
  const delivery = {
    ...TRUST[0],
    text: (
      <>
        Livraison estimée entre le <Text style={styles.date}>{start}</Text> et le <Text style={styles.date}>{end}</Text>.
      </>
    ),
  };
  const items = acceptReturn ? [delivery, RETURN, ...TRUST.slice(1)] : [delivery, ...TRUST.slice(1)];

  return (
    <View style={styles.wrap}>
      {items.map((t) => (
        <View key={t.title} style={styles.card}>
          <View style={[styles.icon, { backgroundColor: t.bg }]}>
            <Ionicons name={t.icon} size={22} color="#fff" />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.text}>{t.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  icon: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  textCol: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  text: { fontSize: 14, color: colors.textMuted, marginTop: 2, lineHeight: 20 },
  date: { fontWeight: '700', color: colors.text },
});
