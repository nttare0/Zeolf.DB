import { useCallback } from 'react';

interface ErrorHandlerOptions {
  showNotification?: boolean;
  logToConsole?: boolean;
  trackAnalytics?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    context: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showNotification = true,
      logToConsole = true,
      trackAnalytics = true
    } = options;

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log to console in development
    if (logToConsole && process.env.NODE_ENV === 'development') {
      console.error(`Error in ${context}:`, error);
    }

    // Track error in analytics
    if (trackAnalytics) {
      try {
        const errorData = {
          context,
          message: errorMessage,
          stack: errorStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        };

        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push(errorData);

        // Keep only last 100 errors
        if (errors.length > 100) {
          errors.splice(0, errors.length - 100);
        }

        localStorage.setItem('app_errors', JSON.stringify(errors));
      } catch (e) {
        console.error('Failed to track error:', e);
      }
    }

    // Show user-friendly notification
    if (showNotification) {
      // This could be enhanced with a toast notification system
      console.warn(`Error in ${context}: ${errorMessage}`);
    }

    return errorMessage;
  }, []);

  const handleAsyncError = useCallback(async (
    asyncOperation: () => Promise<any>,
    context: string,
    options?: ErrorHandlerOptions
  ) => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, context, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};