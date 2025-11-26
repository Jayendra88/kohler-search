// Component exports
export { default as FilterTag } from './FilterTag';
export { default as FacetCheckbox } from './FacetCheckbox';
export { default as DropdownHeader } from './DropdownHeader';
export { default as SelectedFilters } from './SelectedFilters';
export { default as FilterDropdown } from './FilterDropdown';
export { default as LoadingPlaceholder } from './LoadingPlaceholder';

// Re-export types from centralized location
export type {
  FilterTagProps,
  FacetItem,
  FacetCheckboxProps,
  DropdownHeaderProps,
  SelectedFiltersProps,
  FilterDropdownProps,
  FacetGroup,
  LoadingPlaceholderProps
} from '../../types';