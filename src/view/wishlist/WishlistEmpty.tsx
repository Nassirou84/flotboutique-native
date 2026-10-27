import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { signedIn: boolean };

export function WishlistEmpty({ signedIn }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name="heart-outline" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{signedIn ? 'Aucun favori pour le moment' : 'Connectez-vous pour vos favoris'}</Text>
      <Text style={styles.text}>
        {signedIn
          ? 'Touchez le cœur d’un produit pour le retrouver ici et suivre son prix.'
          : 'Enregistrez vos produits préférés et retrouvez-les sur tous vos appareils.'}
      </Text>
      <Pressable
        onPress={() => router.navigate(signedIn ? '/catalogue' : '/connexion')}
        style={styles.cta}
        accessibilityRole="button">
        <Text style={styles.ctaText}>{signedIn ? 'Parcourir le catalogue' : 'Se connecter'}</Text>
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
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  text: { textAlign: 'center', color: colors.textMuted },
  cta: { marginTop: 12, height: 44, paddingHorizontal: 20, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
});
