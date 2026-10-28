import type { ProductCondition } from './product';

/** A plain search keyword (e.g. a brand) proposed as you type. */
export interface KeySuggestion {
  type: 'key';
  key: string;
}

/** A product whose title matches what is being typed. `coverImage` is null when it has no photo. */
export interface ProductSuggestion {
  type: 'product';
  title: string;
  slug: string;
  productCondition?: ProductCondition | null;
  coverImage?: string | null;
}

export type SearchSuggestion = KeySuggestion | ProductSuggestion;

/** Response of `GET /api/product/search-suggestions?q=…` (`ProductSearchSuggestionController`). */
export interface SearchSuggestionsResponse {
  query: string;
  suggestions: SearchSuggestion[];
}
