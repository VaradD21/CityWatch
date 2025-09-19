import React from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Route-specific error boundary that provides better error handling for route components
 */
const RouteErrorBoundary = ({ children, fallback }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;
