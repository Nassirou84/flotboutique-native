import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useSearch } from './use-search';

/** Full-screen search opened from the home and catalogue search bars, with product predictions as you type. */
export function SearchView() {
  const { query, setQuery, submit, ...results } = useSearch();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SearchInput value={query} onChangeText={setQuery} onSubmit={submit} />
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
        <SearchResults submit={submit} {...results} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
});
