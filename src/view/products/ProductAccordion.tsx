import { Ionicons } from '@expo/vector-icons';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function ProductAccordion({ icon, title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={styles.head}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft, borderRadius: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  title: { flex: 1, fontSize: 17, fontWeight: '600', color: colors.text },
  body: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
});
