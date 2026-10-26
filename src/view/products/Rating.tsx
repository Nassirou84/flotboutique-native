import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function Rating({ value }: { value: number }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={value >= n ? 'star' : value >= n - 0.5 ? 'star-half' : 'star-outline'}
          size={16}
          color={colors.star}
        />
      ))}
      <Text style={styles.text}>{value.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 8 },
  text: { marginLeft: 6, fontWeight: '700', color: colors.text },
});
