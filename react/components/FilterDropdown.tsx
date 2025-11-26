import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import FacetCheckbox from './FacetCheckbox';
import DropdownHeader from './DropdownHeader';
import type { FilterDropdownProps, FacetItem } from '../types';

const FilterDropdown: React.FC<FilterDropdownProps> = ({ facetGroup, selectedValues, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedCount = useMemo(() => {
    return facetGroup.facets.filter(facet => selectedValues.has(facet.value)).length;
  }, [facetGroup.facets, selectedValues]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [isOpen]);

  const handleCheckboxChange = useCallback((facet: FacetItem, checked: boolean) => {
    console.log('>> Checkbox changed:', { ...facet, checked });
    onSelectionChange({...facet });
  }, [onSelectionChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }, [isOpen]);

  return (
    <div className="horizontal-filter-dropdown" ref={dropdownRef}>
      <button 
        className={`dropdown-trigger ${selectedCount > 0 ? 'has-selections' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
      >
        <span className="dropdown-title">
          {facetGroup.name}
          {selectedCount > 0 && <span className="selection-count">({selectedCount})</span>}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <DropdownHeader 
            title={facetGroup.name}
            onClose={() => setIsOpen(false)}
          />
          
          <div className="facet-list">
            {facetGroup.facets.map((facet) => (
              <FacetCheckbox
                key={facet.value}
                facet={facet}
                isSelected={selectedValues.has(facet.value)}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;