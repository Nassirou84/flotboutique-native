import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { IconName } from '@/view/orders/constants';

const PERKS: { icon: IconName; label: string }[] = [
  { icon: 'bus-outline', label: 'Suivez vos livraisons en temps réel' },
  { icon: 'heart-outline', label: 'Retrouvez vos favoris sur tous vos appareils' },
  { icon: 'shield-checkmark-outline', label: 'Gérez vos garanties et vos factures' },
];

export function GuestAccount() {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name="person-outline" size={40} color="#1D4ED8" />
      </View>
      <Text style={styles.title}>Connectez-vous</Text>
      <Text style={styles.text}>Accédez à votre espace client Flot Boutique.</Text>

      <View style={styles.perks}>
        {PERKS.map(({ icon, label }) => (
          <View key={label} style={styles.perk}>
            <Ionicons name={icon} size={18} color={colors.primary} />
            <Text style={styles.perkText}>{label}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={() => router.navigate('/connexion')} style={styles.primary} accessibilityRole="button">
        <Text style={styles.primaryText}>Se connecter</Text>
      </Pressable>
      <Pressable onPress={() => router.navigate('/inscription')} hitSlop={8} accessibilityRole="button">
        <Text style={styles.link}>Créer un compte client</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  icon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center' },
  text: { textAlign: 'center', color: colors.textMuted },
  perks: {
    alignSelf: 'stretch',
    marginTop: 12,
    padding: 14,
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkText: { flex: 1, fontSize: 13.5, color: colors.text },
  primary: {
    alignSelf: 'stretch',
    marginTop: 16,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  link: { marginTop: 8, fontSize: 15, fontWeight: '800', color: '#1D4ED8' },
});
