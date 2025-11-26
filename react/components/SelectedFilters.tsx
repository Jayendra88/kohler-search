import React from 'react';
import { useCssHandles } from 'vtex.css-handles';
import FilterTag from './FilterTag';
import type { SelectedFiltersProps } from '../types';

const CSS_HANDLES = [
  'selectedFilters',
  'selectedFiltersTitle',
  'filterTags',
]

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ selectedFacets, onRemoveFilter }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <div className={`${handles.selectedFilters} selected-filters`}>
      <div className={`${handles.selectedFiltersTitle} selected-filters-title`}>
        Active Filters ({selectedFacets.length}):
      </div>
      <div className={`${handles.filterTags} filter-tags`}>
        {selectedFacets.map((facet) => (
          <FilterTag
            key={facet.value}
            facet={facet}
            onRemove={onRemoveFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectedFilters;