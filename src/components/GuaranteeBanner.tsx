import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

const PERKS: { icon: IconName; label: string }[] = [
  { icon: 'car-outline', label: '2h chrono' },
  { icon: 'cash-outline', label: 'Wave & OM' },
  { icon: 'construct-outline', label: 'Atelier 40 pts' },
];

export function GuaranteeBanner() {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons name="shield-checkmark-outline" size={22} color="#1D4ED8" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Garantie & Atelier Cocody Angré</Text>
        <Text style={styles.text}>
          Tous nos produits sont minutieusement testés avant expédition. Livraison express 2h sur
          Abidjan et paiement sécurisé via Wave, Orange Money ou à la réception.
        </Text>
        <View style={styles.perks}>
          {PERKS.map((p) => (
            <View key={p.label} style={styles.perk}>
              <Ionicons name={p.icon} size={16} color="#1D4ED8" />
              <Text style={styles.perkText}>{p.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#DDE5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  text: { fontSize: 13.5, lineHeight: 21, color: colors.textMuted, marginTop: 6 },
  perks: { flexDirection: 'row', gap: 14, marginTop: 14 },
  perk: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  perkText: { flex: 1, fontSize: 11.5, fontWeight: '600', color: '#1D4ED8' },
});
