import { useState, useCallback, useRef, useEffect } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface AsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  retries?: number;
  retryDelay?: number;
}

export function useAsyncState<T = any>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: AsyncOptions = {}
) {
  const {
    immediate = false,
    onSuccess,
    onError,
    retries = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      if (!isMountedRef.current) return;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFn(...args);
        
        if (!isMountedRef.current) return;

        setState({
          data: result,
          loading: false,
          error: null,
        });

        onSuccess?.(result);
        retryCountRef.current = 0;
      } catch (error: any) {
        if (!isMountedRef.current) return;

        const errorMessage = error?.message || 'An error occurred';
        
        // Retry logic
        if (retryCountRef.current < retries) {
          retryCountRef.current++;
          setTimeout(() => {
            if (isMountedRef.current) {
              execute(...args);
            }
          }, retryDelay);
          return;
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        onError?.(errorMessage);
        retryCountRef.current = 0;
      }
    },
    [asyncFn, onSuccess, onError, retries, retryDelay]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    retryCountRef.current = 0;
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    setLoading,
    isIdle: !state.loading && !state.error && !state.data,
    isSuccess: !state.loading && !state.error && !!state.data,
    isError: !state.loading && !!state.error,
  };
}

// Specialized hooks for common patterns
export function useAsyncCallback<T = any>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: AsyncOptions = {}
) {
  return useAsyncState(asyncFn, { ...options, immediate: false });
}

export function useAsyncEffect<T = any>(
  asyncFn: (...args: any[]) => Promise<T>,
  deps: any[] = [],
  options: AsyncOptions = {}
) {
  const asyncState = useAsyncState(asyncFn, { ...options, immediate: false });

  useEffect(() => {
    asyncState.execute();
  }, deps);

  return asyncState;
}
