import { useState, useCallback } from 'react';

interface UseScreenStateReturn {
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  onRefresh: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function useScreenState(
  refreshCallback?: () => void | Promise<void>,
  loadingCallback?: () => void | Promise<void>
): UseScreenStateReturn {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (refreshCallback) {
        await refreshCallback();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, [refreshCallback]);

  const handleSetLoading = useCallback(async (loading: boolean) => {
    setIsLoading(loading);
    if (loading && loadingCallback) {
      try {
        await loadingCallback();
      } catch (error) {
        console.error('Loading error:', error);
      }
    }
  }, [loadingCallback]);

  return {
    refreshing,
    setRefreshing,
    onRefresh,
    isLoading,
    setIsLoading: handleSetLoading,
  };
}
