import React from 'react';
import type { DropdownHeaderProps } from '../types';

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="dropdown-header">
      <h3 className="dropdown-header-title">{title}</h3>
      <button 
        className="dropdown-close"
        onClick={onClose}
        aria-label="Close filter dropdown"
      >
        ×
      </button>
    </div>
  );
};

export default DropdownHeader;