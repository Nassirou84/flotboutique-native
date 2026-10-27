import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { filtered: boolean };

export function OrdersEmpty({ filtered }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name="bus-outline" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{filtered ? 'Aucune commande trouvée' : 'Aucune commande pour le moment'}</Text>
      <Text style={styles.text}>
        {filtered ? 'Essayez un autre filtre ou un autre numéro de commande.' : 'Vos commandes apparaîtront ici dès votre premier achat.'}
      </Text>
      {filtered ? null : (
        <Pressable onPress={() => router.navigate('/catalogue')} style={styles.cta} accessibilityRole="button">
          <Text style={styles.ctaText}>Parcourir le catalogue</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, padding: 32, paddingTop: 48 },
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
