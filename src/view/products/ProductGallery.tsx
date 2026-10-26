import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  photos: string[];
  /** When set to one of `photos`, the carousel scrolls to it. */
  activePhoto?: string;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export function ProductGallery({ photos, activePhoto, favorite, onToggleFavorite }: Props) {
  const { width } = useWindowDimensions();
  const size = width - 32;
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    const target = activePhoto ? photos.indexOf(activePhoto) : -1;
    if (target < 0) return;
    listRef.current?.scrollToOffset({ offset: target * size, animated: true });
  }, [activePhoto, photos, size]);

  return (
    <View style={styles.wrap}>
      <View style={styles.certified}>
        <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
        <Text style={styles.certifiedText}>Certifié Flot Boutique</Text>
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={22}
            color={favorite ? colors.danger : colors.text}
          />
        </Pressable>
      </View>

      <View style={[styles.gallery, { height: size * 0.75 }]}>
        {photos.length > 0 ? (
          <FlatList
            ref={listRef}
            data={photos}
            keyExtractor={(u) => u}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / size))}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width: size, height: size * 0.75 }} contentFit="contain" />
            )}
          />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={64} color="#94A3B8" />
          </View>
        )}
      </View>

      {photos.length > 1 ? (
        <View style={styles.dots}>
          {photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16 },
  certified: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  certifiedText: { flex: 1, fontSize: 12, color: colors.textMuted },
  heart: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gallery: { borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surface },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CBD5E1' },
  dotActive: { width: 22, backgroundColor: colors.primary },
});
