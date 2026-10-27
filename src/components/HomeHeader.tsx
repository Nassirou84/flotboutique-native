import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-provider';
import { colors } from '@/theme/colors';
import { useNotifications } from '@/view/notifications';

export function HomeHeader({ title = 'Accueil' }: { title?: string }) {
  const { authenticated } = useAuth();
  const { unreadCount } = useNotifications();

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
        <Pressable
          onPress={() => router.push('/notifications')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={unreadCount > 0 ? `Notifications, ${unreadCount} non lues` : 'Notifications'}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => router.navigate(authenticated ? '/compte' : '/connexion')}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel={authenticated ? 'Mon compte' : 'Se connecter'}>
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9.5, fontWeight: '800' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
