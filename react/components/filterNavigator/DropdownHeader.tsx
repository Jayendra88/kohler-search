import React from 'react';
import { useCssHandles } from 'vtex.css-handles'
import type { DropdownHeaderProps } from '../../types';
import './filterNavigator.css';

const CSS_HANDLES = [
  'dropdownHeader',
  'dropdownHeaderTitle',
  'dropdownClose',
]

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ title, onClose }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  return (
    <div className={`${handles.dropdownHeader} dropdown-header`}>
      <h3 className={`${handles.dropdownHeaderTitle} dropdown-header-title`}>{title}</h3>
      <button 
        className={`${handles.dropdownClose} dropdown-close`}
        onClick={onClose}
        aria-label="Close filter dropdown"
      >
        ×
      </button>
    </div>
  );
};

export default DropdownHeader;