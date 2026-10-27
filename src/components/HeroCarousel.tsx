import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '@/theme/colors';

export type HeroSlide = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  /** Remote background image. Falls back to a dark gradient-like panel when absent. */
  image?: string;
  onPress: () => void;
};

const HEIGHT = 175;
/** Time each slide stays before the carousel moves on by itself. */
const AUTO_SLIDE_MS = 5000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const { width } = useWindowDimensions();
  const slideWidth = width - 32;
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<HeroSlide>>(null);
  // Held while a finger is on the carousel, and while the home tab is not on screen.
  const [dragging, setDragging] = useState(false);
  const focused = useIsFocused();

  // Moves to the next slide (back to the first after the last). Keyed on `index`, so a manual swipe restarts the wait.
  useEffect(() => {
    if (dragging || !focused || slides.length < 2) return;
    const timer = setTimeout(() => {
      const next = (index + 1) % slides.length;
      listRef.current?.scrollToOffset({ offset: next * slideWidth, animated: true });
      setIndex(next);
    }, AUTO_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, dragging, focused, slides.length, slideWidth]);

  return (
    <View style={[styles.wrap, { width: slideWidth }]}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setDragging(true)}
        onScrollEndDrag={() => setDragging(false)}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / slideWidth))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: slideWidth }]}>
            {item.image ? <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />
            <View style={styles.badge}>
              <Ionicons name="flame" size={12} color="#FDBA74" />
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
            <Pressable onPress={item.onPress} style={styles.cta} accessibilityRole="button">
              <Text style={styles.ctaText}>{item.cta}</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>
          </View>
        )}
      />
      <View style={styles.dots} pointerEvents="none">
        {slides.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: HEIGHT, borderRadius: 18, overflow: 'hidden', backgroundColor: '#0B1220' },
  slide: { height: HEIGHT, padding: 16, justifyContent: 'flex-end', backgroundColor: '#0F1B33' },
  overlay: { backgroundColor: 'rgba(8,14,28,0.55)' },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.orange,
  },
  badgeText: { color: '#fff', fontSize: 11.5, fontWeight: '800', letterSpacing: 0.3 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13.5, marginTop: 2 },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#1D4ED8',
  },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  dots: { position: 'absolute', right: 16, bottom: 18, flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 18, backgroundColor: '#fff' },
});
