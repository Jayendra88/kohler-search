import React from 'react';
import { useCssHandles } from 'vtex.css-handles';
import type { FilterTagProps } from '../types';

const CSS_HANDLES = [
  'filterTag',
  'tagText',
  'tagRemove',
]

const FilterTag: React.FC<FilterTagProps> = ({ facet, onRemove }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  return (
    <div className={`${handles.filterTag} filter-tag`}>
      <span className={`${handles.tagText} tag-text`}>{facet.name}</span>
      <button 
        className={`${handles.tagRemove} tag-remove`}
        onClick={() => onRemove(facet.value)}
        aria-label={`Remove ${facet.name} filter`}
      >
        ×
      </button>
    </div>
  );
};

export default FilterTag;