import React from 'react';
import { useCssHandles } from 'vtex.css-handles'
import type { FacetCheckboxProps } from '../types';
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
    <label className={`${handles.facetItem} facet-item`}>
      <input
        className={`${handles.facetCheckboxInput} facet-checkbox-input`}
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onChange(facet, e.target.checked)}
      />
      <span className={`${handles.facetName} facet-name`}>{facet.name}</span>
      <span className={`${handles.facetQuantity} facet-quantity`}>({facet.quantity})</span>
    </label>
  );
};

export default FacetCheckbox;