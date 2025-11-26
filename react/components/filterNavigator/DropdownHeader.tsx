import React from 'react';
import { useCssHandles } from 'vtex.css-handles'
import type { DropdownHeaderProps } from '../../types';
import './filterNavigator.css';

const CSS_HANDLES = [
  'filterDropdownHeader',
  'filterDropdownHeaderTitle',
  'filterDropdownHeaderClose',
]

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ title, onClose }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  return (
    <div className={handles.filterDropdownHeader}>
      <h3 className={handles.filterDropdownHeaderTitle}>{title}</h3>
      <button 
        className={handles.filterDropdownHeaderClose}
        onClick={onClose}
        aria-label="Close filter dropdown"
      >
        ×
      </button>
    </div>
  );
};

export default DropdownHeader;