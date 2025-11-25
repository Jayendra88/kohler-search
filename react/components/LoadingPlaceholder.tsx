import React from 'react';
import type { LoadingPlaceholderProps } from '../types';

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({ 
  message = "Loading filters..." 
}) => {
  return (
    <div className="horizontal-filter-navigator horizontal-filter-navigator--loading">
      <div className="loading-placeholder">{message}</div>
    </div>
  );
};

export default LoadingPlaceholder;