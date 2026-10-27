import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { comingSoon } from '@/view/orders/constants';

import type { MenuItem } from './constants';

type Props = { item: MenuItem; last: boolean };

export function AccountMenuRow({ item, last }: Props) {
  const open = () => (item.href ? router.navigate(item.href) : comingSoon(item.label));

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && { backgroundColor: colors.background }]}
      accessibilityRole="button"
      accessibilityLabel={item.label}>
      <View style={styles.icon}>
        <Ionicons name={item.icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.label} numberOfLines={1}>
          {item.label}
        </Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
      {item.value ? (
        <Text style={[styles.value, item.valueTone === 'good' && styles.valueGood]}>{item.value}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.strike} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 60, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: 1 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 12.5, color: colors.textMuted },
  value: { fontSize: 12.5, fontWeight: '600', color: colors.textMuted },
  valueGood: { color: colors.green },
});
