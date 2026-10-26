import { StyleSheet, View } from 'react-native';

import { CategoryChips } from '@/components/Chips';
import { HomeHeader } from '@/components/HomeHeader';
import { SearchBar } from '@/components/SearchBar';

import { CatalogueResultsBar } from './CatalogueResultsBar';
import { CATEGORIES, type Category, type Sort } from './constants';

type Props = {
  query: string;
  onChangeQuery: (q: string) => void;
  category: Category;
  onSelectCategory: (c: Category) => void;
  resultCount: number;
  sort: Sort;
  onCycleSort: () => void;
};

export function CatalogueHeader(props: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.pad}>
        <HomeHeader title="Catalogue" />
      </View>
      <View style={styles.pad}>
        <SearchBar value={props.query} onChangeText={props.onChangeQuery} />
      </View>
      <CategoryChips options={CATEGORIES} selected={props.category} onSelect={props.onSelectCategory} />
      <CatalogueResultsBar count={props.resultCount} sort={props.sort} onCycleSort={props.onCycleSort} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 14, paddingTop: 8, paddingBottom: 12 },
  pad: { paddingHorizontal: 16 },
});
