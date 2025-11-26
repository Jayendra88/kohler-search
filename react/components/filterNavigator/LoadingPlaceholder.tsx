import React from 'react';
import { useCssHandles } from 'vtex.css-handles';
import type { LoadingPlaceholderProps } from '../../types';

const CSS_HANDLES = [
  'horizontalFilterNavigatorContainer',
  'loadingPlaceholder',
]

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({ 
  message = "Loading filters..." 
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  
  return (
    <div className={`${handles.horizontalFilterNavigatorContainer} ${handles.horizontalFilterNavigatorContainer}--loading`}>
      <div className={handles.loadingPlaceholder}>{message}</div>
    </div>
  );
};

export default LoadingPlaceholder;