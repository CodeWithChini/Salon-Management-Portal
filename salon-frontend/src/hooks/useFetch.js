import { useCallback, useEffect, useState } from 'react';

/**
 * Small data-fetching hook shared across pages: tracks loading/error state
 * and exposes a `refetch` so pages can re-pull data after a mutation.
 *
 * `fetcher` should be a stable callback (wrap in useCallback at the call site
 * when it depends on props/state) that resolves to the data to store.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, refetch: load };
}
