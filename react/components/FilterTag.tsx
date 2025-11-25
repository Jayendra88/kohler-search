import React from 'react';
import type { FilterTagProps } from '../types';

const FilterTag: React.FC<FilterTagProps> = ({ facet, onRemove }) => {
  return (
    <div className="filter-tag">
      <span className="tag-text">{facet.name}</span>
      <button 
        className="tag-remove"
        onClick={() => onRemove(facet.value)}
        aria-label={`Remove ${facet.name} filter`}
      >
        ×
      </button>
    </div>
  );
};

export default FilterTag;