import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { title: string; subtitle?: string; right?: ReactNode; children: ReactNode };

/** White section card used by every checkout step. */
export function CheckoutCard({ title, subtitle, right, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  headText: { flex: 1, gap: 2 },
  title: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', color: '#475569' },
  subtitle: { fontSize: 13, color: colors.textMuted },
});
