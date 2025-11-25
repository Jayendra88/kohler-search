import React, { useCallback, useMemo } from 'react';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';

import { FilterDropdown, LoadingPlaceholder, SelectedFilters } from './components';
import { FacetTransformer } from './utils';
import { useFacetNavigation, useFilterState } from './hooks';
import type { FacetItem } from './types';

const HorizontalFilterNavigator = () => {
  const {
    searchQuery,
    map,
    showFacets,
  } = useSearchPage();

  // Transform facets data using the transformer utility
  const facetGroups = useMemo(() => {
    return FacetTransformer.transformAllFacets(searchQuery?.data?.facets || {});
  }, [searchQuery?.data?.facets]);

//   const filtersFetchMore =
//       searchQuery && searchQuery.facets && searchQuery.facets.facetsFetchMore
//         ? searchQuery.facets.facetsFetchMore
//         : undefined

    const facets =
      searchQuery && searchQuery.data && searchQuery.data.facets
        ? searchQuery.data.facets
        : {}

    const {
      categoriesTrees,
    } = facets

    console.log('>> Facet Groups:', facetGroups);
    console.log('>> Facets:', facets);


  // Use the custom hook for filter state management
  const { selectedFilters, updateSelection } = useFilterState(facetGroups);

  const getSelectedCategories = (tree: any[]): any[] => {
  for (const node of tree) {
    if (!node.selected) {
      continue
    }

    if (node.children) {
      return [node, ...getSelectedCategories(node.children)]
    }

    return [node]
  }

  return []
}

  const selectedCategories = getSelectedCategories(categoriesTrees || [])
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedCategories.concat(selectedFilters)
    }, [selectedFilters, selectedCategories]),
    'none'
  )

  const handleSelectionChange = useCallback((facetType: string, key: string | null, value: string, selected: boolean) => {

    console.log('>> Handling selection change:', { facetType, key, value, selected }); 
    // Update local state
    updateSelection(value, selected);

    // Navigate using the navigation service
    navigateToFacet(selectedFilters, false, true);
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