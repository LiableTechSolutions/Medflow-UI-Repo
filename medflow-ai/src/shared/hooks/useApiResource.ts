import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../core/api/client';

interface ResourceState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

/**
 * Loads data from the API and tracks loading/error state.
 *
 * `deps` behaves like a `useEffect` dependency list — pass the filters the request
 * depends on (page, search term, …) and the hook refetches when they change.
 */
export function useApiResource<T>(loader: () => Promise<T>, deps: unknown[] = []): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  // The loader closes over the filters, so it is intentionally re-created per render;
  // `deps` is what decides when we actually go back to the server.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    run()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof ApiError ? cause.message : 'Something went wrong');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [run, reloadToken]);

  return { data, error, isLoading, reload: () => setReloadToken((token) => token + 1) };
}
