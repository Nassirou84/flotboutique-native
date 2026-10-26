import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function BasketEmpty() {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name="bag-outline" size={40} color="#1D4ED8" />
      </View>
      <Text style={styles.title}>Votre panier est vide</Text>
      <Text style={styles.text}>Ajoutez des produits certifiés pour les retrouver ici.</Text>
      <Pressable
        onPress={() => router.navigate('/catalogue')}
        style={styles.cta}
        accessibilityRole="button">
        <Text style={styles.ctaText}>Parcourir le catalogue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, padding: 32, paddingTop: 72 },
  icon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  text: { textAlign: 'center', color: colors.textMuted },
  cta: { marginTop: 12, height: 44, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#1D4ED8', justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
});
