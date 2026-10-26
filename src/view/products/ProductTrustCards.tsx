import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TRUST: { icon: IconName; bg: string; title: string; text: string }[] = [
  {
    icon: 'rocket-outline',
    bg: '#1D4ED8',
    title: 'Livraison Express Abidjan',
    text: 'Livré en 2h à 24h à Cocody, Plateau, Marcory, Yopougon et périphérie.',
  },
  {
    icon: 'cash-outline',
    bg: '#475569',
    title: 'Paiement 100% Sécurisé',
    text: 'Payez à la réception après contrôle, ou instantanément via Wave et Orange Money.',
  },
  {
    icon: 'newspaper-outline',
    bg: colors.orange,
    title: 'Garantie Flot Care',
    text: 'Échange standard immédiat en boutique ou réparation express sans frais cachés.',
  },
];

export function ProductTrustCards() {
  return (
    <View style={styles.wrap}>
      {TRUST.map((t) => (
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
});
