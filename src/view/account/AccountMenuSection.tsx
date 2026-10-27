import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { AccountMenuRow } from './AccountMenuRow';
import type { MenuSection } from './constants';

export function AccountMenuSection({ section }: { section: MenuSection }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{section.title}</Text>
      <View style={styles.card}>
        {section.items.map((item, index) => (
          <AccountMenuRow key={item.key} item={item} last={index === section.items.length - 1} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 20 },
  title: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
