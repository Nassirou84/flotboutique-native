import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionTitle } from '@/components/SectionTitle';

type Props = {
  title: string;
  /** Link shown at the right of the title. */
  action?: { label: string; icon: 'chevron-forward' | 'help-circle-outline'; onPress?: () => void };
  children: ReactNode;
};

/** A titled block of the home screen, with an optional link next to the title. */
export function HomeSection({ title, action, children }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionTitle>{title}</SectionTitle>
        {action ? (
          <Pressable onPress={action.onPress} style={styles.link} accessibilityRole="link">
            <Text style={styles.linkText}>{action.label}</Text>
            <Ionicons name={action.icon} size={action.icon === 'chevron-forward' ? 14 : 15} color="#1D4ED8" />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  linkText: { fontSize: 13, fontWeight: '600', color: '#1D4ED8' },
});
