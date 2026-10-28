import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type DimensionValue } from 'react-native';

import { colors } from '@/theme/colors';

const BONE = '#E2E8F0';

function Bone({ width, height, radius = 6, style }: { width: DimensionValue; height: number; radius?: number; style?: object }) {
  return <View style={[{ width, height, borderRadius: radius, backgroundColor: BONE }, style]} />;
}

/** Placeholder with the same layout as `ProductCard`, shown while products load. */
export function ProductCardSkeleton() {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.card, { opacity }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Chargement du produit">
      <View style={styles.imageWrap}>
        <Bone width={70} height={20} radius={999} />
        <Bone width={30} height={30} radius={15} style={styles.heart} />
      </View>

      <View style={styles.body}>
        <Bone width="90%" height={14} />
        <Bone width="60%" height={14} style={styles.line} />
        <Bone width="40%" height={12} style={styles.line} />

        <View style={styles.priceBlock}>
          <Bone width="55%" height={18} />
          <Bone width="35%" height={11} style={styles.line} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  imageWrap: { height: 168, backgroundColor: colors.imageBg, padding: 10 },
  heart: { position: 'absolute', top: 8, right: 8 },
  body: { padding: 12, flex: 1 },
  line: { marginTop: 6 },
  priceBlock: { marginTop: 'auto', paddingTop: 12, minHeight: 40, justifyContent: 'flex-end' },
});
