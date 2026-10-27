import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = { title: string; onBack: () => void };

export function CheckoutHeader({ title, onBack }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onBack} hitSlop={8} style={styles.back} accessibilityRole="button" accessibilityLabel="Retour">
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.back} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: 52, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
});
