import React from 'react';
import type { FacetCheckboxProps } from '../types';

const FacetCheckbox: React.FC<FacetCheckboxProps> = ({ facet, isSelected, onChange }) => {
  return (
    <label className="facet-item">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onChange(facet, e.target.checked)}
      />
      <span className="facet-name">{facet.name}</span>
      <span className="facet-quantity">({facet.quantity})</span>
    </label>
  );
};

export default FacetCheckbox;