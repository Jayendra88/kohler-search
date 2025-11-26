import { useState, useMemo, useCallback } from 'react';
import type { FacetGroup, FilterStateHookReturn } from '../types';

export const useFilterState = (facetGroups: FacetGroup[]): FilterStateHookReturn => {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  // Initialize selected filters from current search state
  useMemo(() => {
    const initialSelected = new Set<string>();
    
    facetGroups.forEach(group => {
      group.facets.forEach(facet => {
        if (facet.selected) {
          initialSelected.add(facet.value);
        }
      });
    });
    
    setSelectedFilters(initialSelected);
  }, [facetGroups]);

  const updateSelection = useCallback((value: string, selected: boolean) => {
    setSelectedFilters(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(value);
      } else {
        newSelected.delete(value);
      }
      return newSelected;
    });
  }, []);

  return {
    selectedFilterValues: selectedFilters,
    updateSelection
  };
};