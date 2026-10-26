import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { resolveImage } from '@/data/products';
import { colors } from '@/theme/colors';
import type { ActualVariant } from '@/types/product';
import { formatPrice } from '@/utils/format';

type Props = { variants: ActualVariant[]; selectedId?: string; onSelect: (id: string) => void };

export function ProductVariantPicker({ variants, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      accessibilityRole="radiogroup">
      {variants.map((v) => {
        const selected = v.id === selectedId;
        const image = resolveImage(v.image);
        return (
          <Pressable
            key={v.id}
            onPress={() => onSelect(v.id)}
            style={[styles.tile, selected && styles.tileActive]}
            accessibilityRole="radio"
            accessibilityLabel={v.title}
            accessibilityState={{ selected }}>
            {image ? (
              <Image source={{ uri: image }} style={styles.thumb} contentFit="contain" />
            ) : (
              <View style={[styles.thumb, styles.placeholder]}>
                <Ionicons name="cube-outline" size={24} color="#94A3B8" />
              </View>
            )}
            <Text style={styles.title} numberOfLines={2}>
              {v.title}
            </Text>
            {v.actualPrice != null ? <Text style={styles.price}>{formatPrice(v.actualPrice)} F</Text> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 16, gap: 10 },
  tile: {
    width: 112,
    padding: 8,
    gap: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.primarySoft,
  },
  tileActive: { borderColor: '#1D4ED8', backgroundColor: colors.surface },
  thumb: { width: '100%', height: 72, borderRadius: 6, backgroundColor: colors.surface },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 12, color: colors.text, minHeight: 32 },
  price: { fontSize: 13, fontWeight: '700', color: '#1D4ED8' },
});
