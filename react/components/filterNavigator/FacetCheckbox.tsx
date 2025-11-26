import React from 'react';
import { useCssHandles } from 'vtex.css-handles'
import type { FacetCheckboxProps } from '../../types';
import './filterNavigator.css';

const CSS_HANDLES = [
  'facetItem',
  'facetName',
  'facetQuantity',
  'facetCheckboxInput',
]

const FacetCheckbox: React.FC<FacetCheckboxProps> = ({ facet, isSelected, onChange }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  return (
    <label className={handles.facetItem}>
      <input
        className={handles.facetCheckboxInput}
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onChange(facet, e.target.checked)}
      />
      <span className={handles.facetName}>{facet.name}</span>
      <span className={handles.facetQuantity}>({facet.quantity})</span>
    </label>
  );
};

export default FacetCheckbox;