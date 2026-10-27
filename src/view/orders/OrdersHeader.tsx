import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { comingSoon } from './constants';

export function OrdersHeader() {
  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>
        Mes Commandes
      </Text>
      <View style={styles.actions}>
        <Pressable
          onPress={() => comingSoon('Le support')}
          hitSlop={6}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Support et assistance">
          <Ionicons name="headset-outline" size={22} color={colors.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/compte')}
          hitSlop={6}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel="Mon compte">
          <Ionicons name="person" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { flexShrink: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
