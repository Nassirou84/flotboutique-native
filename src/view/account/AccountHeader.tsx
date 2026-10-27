import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function AccountHeader() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>Mon compte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 56, paddingHorizontal: 16, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
});
