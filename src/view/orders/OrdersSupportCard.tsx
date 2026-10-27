import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { comingSoon } from './constants';

export function OrdersSupportCard() {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Ionicons name="headset" size={24} color="#fff" />
        </View>
        <View style={styles.headText}>
          <Text style={styles.title}>Conciergerie Flot SAV</Text>
          <Text style={styles.text}>
            Un souci de commande, un doute sur une livraison ou besoin d’assistance garantie ?
          </Text>
        </View>
      </View>

      <Pressable onPress={() => comingSoon('WhatsApp')} style={styles.button} accessibilityRole="button">
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
        <Text style={styles.buttonText}>WhatsApp Service Client</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    gap: 8,
    borderRadius: 12,
    backgroundColor: '#DCE7FF',
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 8 },
  headText: { flex: 1, gap: 2 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  text: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  button: {
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
  },
  buttonText: { fontSize: 14, fontWeight: '700', color: colors.text },
});
