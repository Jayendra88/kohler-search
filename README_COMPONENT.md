# Horizontal Filter Navigator

A modular, accessible horizontal filter navigator component for VTEX search pages. The component follows single responsibility principles with each sub-component handling a specific concern.

## Architecture

### Components

#### `HorizontalFilterNavigator` (Main Component)
- **Responsibility**: Orchestrates the overall filter navigation experience
- **Location**: `react/HorizontalFilterNavigator.tsx`
- **Dependencies**: Uses all sub-components and utilities

#### `FilterDropdown`
- **Responsibility**: Manages individual dropdown behavior (open/close, keyboard navigation)
- **Location**: `react/components/FilterDropdown.tsx`
- **Features**: Click-outside handling, keyboard navigation, accessibility

#### `FacetCheckbox`
- **Responsibility**: Renders individual facet checkbox items
- **Location**: `react/components/FacetCheckbox.tsx`
- **Features**: Checkbox state management, quantity display

#### `FilterTag`
- **Responsibility**: Renders removable filter tags
- **Location**: `react/components/FilterTag.tsx`
- **Features**: Remove button with accessibility

#### `DropdownHeader`
- **Responsibility**: Mobile dropdown header with close button
- **Location**: `react/components/DropdownHeader.tsx`
- **Features**: Mobile-responsive header

#### `SelectedFilters`
- **Responsibility**: Displays selected filters as tags within dropdown
- **Location**: `react/components/SelectedFilters.tsx`
- **Features**: Tag list rendering, conditional display

#### `LoadingPlaceholder`
- **Responsibility**: Loading state display
- **Location**: `react/components/LoadingPlaceholder.tsx`
- **Features**: Customizable loading message

### Utilities

#### `FacetTransformer`
- **Responsibility**: Transforms VTEX API facet data into component-friendly format
- **Location**: `react/utils/FacetTransformer.ts`
- **Methods**: 
  - `transformBrands()`
  - `transformSpecificationFilters()`
  - `transformCategoriesTrees()`
  - `transformPriceRanges()`
  - `transformAllFacets()`

#### `NavigationService`
- **Responsibility**: Handles URL navigation for facet changes
- **Location**: `react/utils/NavigationService.ts`
- **Features**: VTEX navigation integration, fallback URL manipulation

### Hooks

#### `useFilterState`
- **Responsibility**: Manages selected filter state
- **Location**: `react/hooks/useFilterState.ts`
- **Features**: State initialization from facets, selection updates

## Features

1. **Horizontal Layout**: Filters displayed as horizontal dropdown list
2. **Facet-based Dropdowns**: Each dropdown represents a facet category
3. **Checkbox Selection**: Multi-select checkboxes within each dropdown
4. **URL Integration**: Automatic URL updates on filter changes
5. **Selected Filter Display**: Shows selected filters as tags within dropdowns
6. **Tag Removal**: Click to remove individual filter tags
7. **Responsive Design**: Mobile-optimized with modal-style dropdowns
8. **Keyboard Navigation**: Full keyboard accessibility
9. **Loading States**: Graceful loading state handling
10. **Style Matching**: Uses existing codebase design patterns

## Usage

The component automatically integrates with VTEX search context:

```tsx
import HorizontalFilterNavigator from './HorizontalFilterNavigator';

// Used in search layout
<div className="horizontal-filter-navigator">
  <HorizontalFilterNavigator />
</div>
```

## Styling

Styles are located in: `store-theme/styles/css/sefuateurope.custom-search.css`

Key CSS classes:
- `.horizontal-filter-navigator` - Main container
- `.horizontal-filter-dropdown` - Individual dropdown
- `.dropdown-trigger` - Dropdown button
- `.dropdown-content` - Dropdown panel
- `.facet-item` - Checkbox items
- `.filter-tag` - Selected filter tags

## Testing

Basic tests are provided in `react/__tests__/HorizontalFilterNavigator.test.tsx`

Run tests with:
```bash
yarn test
```

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Keyboard navigation support
- Screen reader accessible