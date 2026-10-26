import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function HomeHeader({ title = 'Accueil' }: { title?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Abidjan, CI</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.dot} />
        </Pressable>
        <Pressable style={styles.avatar} accessibilityRole="button" accessibilityLabel="Profil">
          <Ionicons name="person" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 12.5, color: colors.textMuted },
  right: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dot: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
