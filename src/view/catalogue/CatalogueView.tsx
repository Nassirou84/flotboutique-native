import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import { CatalogueEmpty } from './CatalogueEmpty';
import { CatalogueFooter } from './CatalogueFooter';
import { CatalogueHeader } from './CatalogueHeader';
import { CatalogueProductItem } from './CatalogueProductItem';
import { useCatalogue } from './use-catalogue';

export function CatalogueView() {
  const c = useCatalogue();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={c.products}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReached={c.loadMore}
        onEndReachedThreshold={0.6}
        ListHeaderComponent={
          <CatalogueHeader
            query={c.query}
            onChangeQuery={c.setQuery}
            category={c.category}
            onSelectCategory={c.setCategory}
            resultCount={c.resultCount}
            sort={c.sort}
            onCycleSort={c.cycleSort}
          />
        }
        renderItem={({ item }) => <CatalogueProductItem product={item} />}
        ListEmptyComponent={
          <CatalogueEmpty isLoading={c.isLoading} isError={c.isError} error={c.error} onRetry={c.refetch} />
        }
        ListFooterComponent={<CatalogueFooter loadingMore={c.isFetchingNextPage} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  column: { paddingHorizontal: 8 },
});
