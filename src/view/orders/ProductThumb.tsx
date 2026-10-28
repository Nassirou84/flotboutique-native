import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { useGetProduct } from '@/api/product/products';
import { coverPhotoUrl, resolveImage } from '@/data/products';
import { colors } from '@/theme/colors';

type Props = { size: number; slug?: string };

export function ProductThumb({ size, slug }: Props) {
  // Order items only carry photo IRIs, so the cover comes from the full product (cached, shared with the product page).
  const { data: product } = useGetProduct(slug);
  const uri = resolveImage(coverPhotoUrl(product?.photos));

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} contentFit="contain" />
      ) : (
        <Ionicons name="image-outline" size={size * 0.4} color={colors.strike} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: 8, backgroundColor: colors.imageBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
