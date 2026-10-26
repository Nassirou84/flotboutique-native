import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function SectionTitle({ children }: { children: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.bar} />
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bar: { width: 4, height: 22, borderRadius: 2, backgroundColor: '#1D4ED8' },
  text: { fontSize: 21, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
});
