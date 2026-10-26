import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

export function ComingSoon({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Cet écran sera bientôt disponible.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  text: { marginTop: 6, color: colors.textMuted },
});
