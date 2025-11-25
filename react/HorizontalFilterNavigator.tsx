import React, { useCallback, useMemo } from 'react';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';

import { FilterDropdown, LoadingPlaceholder, SelectedFilters } from './components';
import { FacetTransformer, NavigationService } from './utils';
import { useFilterState } from './hooks';
import type { FacetItem } from './types';

const HorizontalFilterNavigator = () => {
  const {
    searchQuery,
    map,
    showFacets,
    navigateToFacet,
  } = useSearchPage();

  // Transform facets data using the transformer utility
  const facetGroups = useMemo(() => {
    return FacetTransformer.transformAllFacets(searchQuery?.data?.facets || {});
  }, [searchQuery?.data?.facets]);

  // Use the custom hook for filter state management
  const { selectedFilters, updateSelection } = useFilterState(facetGroups);

  const handleSelectionChange = useCallback((facetType: string, key: string | null, value: string, selected: boolean) => {
    // Update local state
    updateSelection(value, selected);

    // Navigate using the navigation service
    NavigationService.navigateToFacet(navigateToFacet, facetType, key, value, selected);
  }, [navigateToFacet, updateSelection]);

  // Collect all selected facets from all groups
  const allSelectedFacets = useMemo(() => {
    const selected: FacetItem[] = [];
    facetGroups.forEach(group => {
      group.facets.forEach(facet => {
        if (selectedFilters.has(facet.value)) {
          selected.push(facet);
        }
      });
    });
    return selected;
  }, [facetGroups, selectedFilters]);

  const handleRemoveFilter = useCallback((value: string) => {
    // Find the facet type and key for the value
    let facetType = '';
    let key: string | null = null;
    
    facetGroups.forEach(group => {
      const facet = group.facets.find(f => f.value === value);
      if (facet) {
        facetType = group.type;
        key = group.key || null;
      }
    });
    
    if (facetType) {
      handleSelectionChange(facetType, key, value, false);
    }
  }, [facetGroups, handleSelectionChange]);

  // Early returns for various states
  if (showFacets === false || !map || facetGroups.length === 0) {
    return null;
  }

  if (!searchQuery?.data) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="horizontal-filter-navigator-container">
      <div className="horizontal-filter-navigator">
        {facetGroups.map((group, index) => (
          <FilterDropdown
            key={`${group.type}-${group.key || index}`}
            facetGroup={group}
            selectedValues={selectedFilters}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>
      
      <SelectedFilters
        selectedFacets={allSelectedFacets}
        onRemoveFilter={handleRemoveFilter}
      />
    </div>
  );
};

export default HorizontalFilterNavigator;