import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function ProductTopBar({ onShare }: { onShare?: () => void }) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Retour">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Fiche Produit</Text>
      {onShare ? (
        <Pressable onPress={onShare} hitSlop={8} accessibilityRole="button" accessibilityLabel="Partager">
          <Ionicons name="share-social-outline" size={22} color={colors.text} />
        </Pressable>
      ) : (
        <View style={{ width: 22 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, height: 52 },
  title: { flex: 1, fontSize: 18, fontWeight: '600', color: colors.text },
});
