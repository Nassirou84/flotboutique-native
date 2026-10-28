import { StyleSheet, View } from 'react-native';

import { CategoryChips } from '@/components/Chips';
import { HomeHeader } from '@/components/HomeHeader';
import { SearchBar } from '@/components/SearchBar';
import { goToSearch } from '@/view/search';

import { CatalogueResultsBar } from './CatalogueResultsBar';
import { TAGS, type Tag, type Sort } from './constants';

type Props = {
  query: string;
  onChangeQuery: (q: string) => void;
  tag: Tag;
  onSelectTag: (c: Tag) => void;
  resultCount: number;
  sort: Sort;
  onCycleSort: () => void;
  activeFilters: number;
  onPressFilters: () => void;
};

export function CatalogueHeader(props: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.pad}>
        <HomeHeader title="Catalogue" />
      </View>
      <View style={styles.pad}>
        <SearchBar
          value={props.query}
          onChangeText={props.onChangeQuery}
          onPressSearch={() => goToSearch(props.query)}
          activeFilters={props.activeFilters}
          onPressFilters={props.onPressFilters}
        />
      </View>
      <CategoryChips options={TAGS} selected={props.tag} onSelect={props.onSelectTag} />
      <CatalogueResultsBar count={props.resultCount} sort={props.sort} onCycleSort={props.onCycleSort} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 14, paddingTop: 8, paddingBottom: 12 },
  pad: { paddingHorizontal: 16 },
});
