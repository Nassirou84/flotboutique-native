import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { count: number; onClear?: () => void };

export function BasketHeader({ count, onClear }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>Panier</Text>
        {count > 0 ? (
          <Text style={styles.subtitle}>
            {count} article{count > 1 ? 's' : ''}
          </Text>
        ) : null}
      </View>
      {onClear ? (
        <Pressable onPress={onClear} hitSlop={8} accessibilityRole="button">
          <Text style={styles.clear}>Vider le panier</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  clear: { fontSize: 13, fontWeight: '600', color: colors.danger },
});
