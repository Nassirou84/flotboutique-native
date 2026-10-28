import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { showSearchResults } from './navigation';
import { SearchSuggestionRow } from './SearchSuggestionRow';
import type { useSearch } from './use-search';

type Props = Pick<ReturnType<typeof useSearch>, 'term' | 'suggestions' | 'pending' | 'isError' | 'refetch' | 'submit'>;

/** The body under the input: a hint, the predictions, or what went wrong. */
export function SearchResults({ term, suggestions, pending, isError, refetch, submit }: Props) {
  if (term.length < 2) {
    return <Text style={styles.hint}>Tapez au moins 2 lettres pour voir des suggestions.</Text>;
  }

  return (
    <View>
      <Pressable
        onPress={submit}
        style={({ pressed }) => [styles.all, pressed && { backgroundColor: colors.primarySoft }]}
        accessibilityRole="button">
        <Ionicons name="search" size={18} color="#1D4ED8" />
        <Text style={styles.allText} numberOfLines={1}>
          Voir tous les résultats pour « {term} »
        </Text>
        {pending ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </Pressable>

      {isError ? (
        <View style={styles.status}>
          <Text style={styles.hint}>Impossible de charger les suggestions.</Text>
          <Pressable onPress={() => refetch()} accessibilityRole="button">
            <Text style={styles.retry}>Réessayer</Text>
          </Pressable>
        </View>
      ) : null}

      {suggestions.map((suggestion) => (
        <SearchSuggestionRow
          key={suggestion.type === 'key' ? `key:${suggestion.key}` : `product:${suggestion.slug}`}
          suggestion={suggestion}
          onSelectKeyword={showSearchResults}
        />
      ))}

      {!pending && !isError && suggestions.length === 0 ? (
        <Text style={styles.hint}>Aucun produit ne correspond à « {term} ».</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  all: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  allText: { flex: 1, fontSize: 14.5, fontWeight: '700', color: '#1D4ED8' },
  hint: { textAlign: 'center', color: colors.textMuted, padding: 24 },
  status: { alignItems: 'center', gap: 4 },
  retry: { fontSize: 13, fontWeight: '600', color: '#1D4ED8' },
});
