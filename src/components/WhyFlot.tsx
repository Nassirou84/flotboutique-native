import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

const ROWS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'bicycle-outline',
    title: 'Livraison Express 2h à Abidjan',
    text: 'Cocody, Plateau, Marcory, Yopougon & Riviera.',
  },
  {
    icon: 'cash-outline',
    title: 'Paiement à la livraison & Mobile Money',
    text: 'Payez en espèces, par Wave ou Orange Money après vérification.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Garantie Flot Care certifiée',
    text: 'Service après-vente & atelier technique physique à Cocody.',
  },
];

export function WhyFlot() {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>POURQUOI FLOT BOUTIQUE ?</Text>
      {ROWS.map((r) => (
        <View key={r.title} style={styles.row}>
          <View style={styles.icon}>
            <Ionicons name={r.icon} size={20} color="#1D4ED8" />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title}>{r.title}</Text>
            <Text style={styles.text}>{r.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 14,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  heading: { fontSize: 12.5, fontWeight: '800', color: '#1D4ED8', letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#DDE5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  text: { fontSize: 12.5, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
});
