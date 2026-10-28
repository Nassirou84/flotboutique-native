import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CONDITION_FROM_API, CONDITION_LABELS, resolveImage } from '@/data/products';
import { colors } from '@/theme/colors';
import type { SearchSuggestion } from '@/types/search-suggestion';

type Props = {
  suggestion: SearchSuggestion;
  /** Called with a keyword suggestion's text to run the full search for it. */
  onSelectKeyword: (keyword: string) => void;
};

export function SearchSuggestionRow({ suggestion, onSelectKeyword }: Props) {
  if (suggestion.type === 'key') {
    return (
      <Pressable
        style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.primarySoft }]}
        onPress={() => onSelectKeyword(suggestion.key)}
        accessibilityRole="button"
        accessibilityLabel={`Rechercher ${suggestion.key}`}>
        <View style={[styles.thumb, styles.keyThumb]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {suggestion.key}
        </Text>
        <Ionicons name="arrow-up-outline" size={18} color={colors.textMuted} style={styles.insert} />
      </Pressable>
    );
  }

  const image = resolveImage(suggestion.coverImage ?? undefined);
  const condition = suggestion.productCondition ? CONDITION_FROM_API[suggestion.productCondition] : undefined;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.primarySoft }]}
      disabled={!suggestion.slug}
      onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: suggestion.slug } })}
      accessibilityRole="button"
      accessibilityLabel={suggestion.title}>
      {image ? (
        <Image source={{ uri: image }} style={styles.thumb} contentFit="contain" />
      ) : (
        <View style={[styles.thumb, styles.placeholder]}>
          <Ionicons name="cube-outline" size={22} color="#94A3B8" />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {suggestion.title}
        </Text>
        {condition ? <Text style={styles.condition}>{CONDITION_LABELS[condition]}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  thumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: colors.surface },
  keyThumb: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2E8F0' },
  info: { flex: 1, gap: 2 },
  name: { flex: 1, fontSize: 14.5, fontWeight: '600', color: colors.text },
  condition: { fontSize: 12.5, fontWeight: '500', color: colors.primary },
  insert: { transform: [{ rotate: '45deg' }] },
});
