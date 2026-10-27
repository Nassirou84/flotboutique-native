import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

// Same four features as the storefront's home page (`PromoSection`), with its French copy.
const ROWS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'globe-outline',
    title: 'Certifié USA',
    text: 'Nous offrons une livraison rapide et fiable avec certification USA.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Paiement sécurisé',
    text: "Nous proposons des options de paiement sécurisées pour votre sécurité et votre tranquillité d'esprit.",
  },
  {
    icon: 'arrow-undo-outline',
    title: 'Produits fiables',
    text: "Retours faciles sous 10 jours après la livraison, dans leur emballage d'origine.",
  },
  {
    icon: 'chatbubble-ellipses-outline',
    title: 'Support 24/7',
    text: 'Notre équipe est toujours là pour vous aider. Contactez-nous à tout moment pour toute question ou préoccupation.',
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
