export interface Subcategory {
  '@id': string;
  '@type': string;
  id: number;
  title: string;
  description?: string;
}

export interface Category {
  '@id': string;
  '@type': string;
  id: string;
  title: string;
  description?: string;
  icon: string;
  subcategories?: Subcategory[];
}
