import React from 'react';
import FilterTag from './FilterTag';
import type { SelectedFiltersProps } from '../types';

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ selectedFacets, onRemoveFilter }) => {
  if (selectedFacets.length === 0) {
    return null;
  }

  return (
    <div className="selected-filters">
      <div className="selected-filters-title">
        Active Filters ({selectedFacets.length}):
      </div>
      <div className="filter-tags">
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