/**
 * Common types for the Horizontal Filter Navigator
 * Centralizes all type definitions to ensure consistency and reusability
 */

// ============================================================================
// CORE FACET TYPES
// ============================================================================

export interface FacetItem {
  id: string;
  quantity: number;
  name: string;
  key: string;
  value: string;
  selected: boolean;
  children?: FacetItem[];
}

export type FacetType = 'brands' | 'specificationFilters' | 'categoriesTrees' | 'priceRanges';

export interface FacetGroup {
  name: string;
  facets: FacetItem[];
  type: FacetType;
  key?: string;
}

// ============================================================================
// VTEX API RESPONSE TYPES
// ============================================================================

export interface VtexBrand {
  id?: string;
  name: string;
  value: string;
  quantity: number;
  key?: string;
  selected?: boolean;
}

export interface VtexPriceRange {
  slug?: string;
  range?: string;
  name?: string;
  quantity: number;
  selected?: boolean;
}

export interface VtexCategory {
  id?: string;
  name: string;
  value: string;
  quantity: number;
  key?: string;
  selected?: boolean;
}

export interface VtexSpecificationFacet {
  id?: string;
  name: string;
  value: string;
  quantity: number;
  key?: string;
  selected?: boolean;
}

export interface VtexSpecificationFilter {
  name: string;
  facets: VtexSpecificationFacet[];
}

export interface VtexFacetsData {
  brands?: VtexBrand[];
  priceRanges?: VtexPriceRange[];
  specificationFilters?: VtexSpecificationFilter[];
  categoriesTrees?: VtexCategory[];
}

export interface VtexSearchQuery {
  data?: {
    facets?: VtexFacetsData;
  };
  variables?: {
    map: string;
    query: string;
  };
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface FilterTagProps {
  facet: FacetItem;
  onRemove: (value: string) => void;
}

export interface FacetCheckboxProps {
  facet: FacetItem;
  isSelected: boolean;
  onChange: (facet: FacetItem, checked: boolean) => void;
}

export interface DropdownHeaderProps {
  title: string;
  onClose: () => void;
}

export interface SelectedFiltersProps {
  selectedFacets: FacetItem[];
  onRemoveFilter: (value: string) => void;
}

export interface FilterDropdownProps {
  facetGroup: FacetGroup;
  selectedValues: Set<string>;
  onSelectionChange: FacetSelectionChangeHandler;
}

export interface LoadingPlaceholderProps {
  message?: string;
}

// ============================================================================
// FUNCTION SIGNATURE TYPES
// ============================================================================

export type FacetSelectionChangeHandler = (
  facetType: string,
  key: string | null,
  value: string,
  selected: boolean
) => void;

export type FacetNavigationHandler = (
  facetType: string,
  key: string | null,
  value: string,
  selected: boolean
) => void;

export type FilterStateUpdater = (value: string, selected: boolean) => void;

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface FilterStateHookReturn {
  selectedFilters: Set<string>;
  updateSelection: FilterStateUpdater;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface FacetNavigationPayload {
  type: string;
  value: string;
  key?: string;
}

export interface NavigationUrlParams {
  map?: string;
  query?: string;
  page?: string;
  fuzzy?: string;
  operator?: string;
  searchState?: string;
  initialMap?: string;
  initialQuery?: string;
  priceRange?: string;
}

// ============================================================================
// SEARCH CONTEXT TYPES
// ============================================================================

export interface SearchPageContext {
  searchQuery?: VtexSearchQuery;
  map?: string;
  showFacets?: boolean;
  navigateToFacet?: (payload: FacetNavigationPayload, selected: boolean) => void;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isFacetItem = (item: any): item is FacetItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.value === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.selected === 'boolean'
  );
};

export const isFacetGroup = (group: any): group is FacetGroup => {
  return (
    typeof group === 'object' &&
    group !== null &&
    typeof group.name === 'string' &&
    Array.isArray(group.facets) &&
    typeof group.type === 'string' &&
    ['brands', 'specificationFilters', 'categoriesTrees', 'priceRanges'].includes(group.type)
  );
};

export const isVtexFacetsData = (data: any): data is VtexFacetsData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    (Array.isArray(data.brands) || data.brands === undefined) &&
    (Array.isArray(data.priceRanges) || data.priceRanges === undefined) &&
    (Array.isArray(data.specificationFilters) || data.specificationFilters === undefined) &&
    (Array.isArray(data.categoriesTrees) || data.categoriesTrees === undefined)
  );
};

// ============================================================================
// GETFILTERS UTILITY TYPES
// ============================================================================

export interface GetFiltersFacet {
  name: string;
  quantity?: number;
  key?: string;
  value?: string;
  selected?: boolean;
}

export interface GetFiltersDeliveryFacet {
  name: string;
  title?: string;
  type?: string;
  facets: GetFiltersFacet[];
  quantity?: number;
  key?: string;
}

export interface GetFiltersHiddenFacets {
  brands?: boolean;
  priceRange?: boolean;
  specificationFilters?: {
    hideAll?: boolean;
    hiddenFilters?: Array<{ name: string }>;
  };
}

export interface GetFiltersResult {
  type: string;
  title: string;
  facets: GetFiltersFacet[];
  quantity?: number;
  key?: string;
}

export interface GetFiltersParams {
  specificationFilters?: VtexSpecificationFilter[];
  priceRanges?: VtexPriceRange[];
  brands?: VtexBrand[];
  deliveries?: GetFiltersDeliveryFacet[];
  brandsQuantity?: number;
  hiddenFacets?: GetFiltersHiddenFacets;
  showShippingFacet?: boolean;
  availableShippingValues?: string[];
}

// ============================================================================
// COMPATIBILITY LAYER TYPES
// ============================================================================

export interface CompatibilityFacetValue {
  id: string | null;
  quantity: number;
  name: string;
  key: string;
  selected: boolean;
  map: string;
  value: string;
  children?: CompatibilityFacetValue[];
}

export interface CompatibilityFacet {
  name: string;
  type: string;
  hidden: boolean;
  quantity: number;
  facets: CompatibilityFacetValue[];
}

export interface SelectedFacet {
  key: string;
  value: string;
}

export interface QueryArgs {
  query: string;
  map: string;
}

export interface MainSearches {
  ft?: string;
  productClusterIds?: string;
  seller?: string;
}

export interface CompatibilityPriceRange {
  range: {
    from: number;
    to: number;
  };
  slug?: string;
  [key: string]: any;
}

export interface DetachedFilters {
  brands: CompatibilityFacetValue[];
  brandsQuantity: number;
  specificationFilters: CompatibilityFacet[];
  categoriesTrees: CompatibilityFacetValue[];
  priceRanges: CompatibilityPriceRange[];
  deliveries: CompatibilityFacet[];
}

export interface GroupedFilters {
  BRAND?: CompatibilityFacet[];
  NUMBER?: CompatibilityFacet[];
  TEXT?: CompatibilityFacet[];
  DELIVERY?: CompatibilityFacet[];
  CATEGORYTREE?: CompatibilityFacet[];
  PRICERANGE?: CompatibilityFacet[];
  [key: string]: CompatibilityFacet[] | undefined;
}