import { useState, useEffect, useCallback, useRef } from 'react';
import searchApi from '@/apis/search/searchApi';
import type { SearchResult } from '@/types/api/searchTypes';
import useToast from '@/hooks/component/useToast';

export const useSearch = (searchQuery: string) => {
  const [result, setResult] = useState<SearchResult>({
    users: [],
    stories: [],
  });
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();
  const isInitialMount = useRef(true);

  const fetchResults = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResult({ users: [], stories: [] });
        return;
      }

      setLoading(true);
      try {
        const data = await searchApi.search({ search: query });
        setResult(data || { users: [], stories: [] });
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        showError(
          error?.response?.data?.message || 'Failed to fetch search results'
        );
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    const delay = isInitialMount.current ? 0 : 300;
    isInitialMount.current = false;

    const timer = setTimeout(() => {
      fetchResults(searchQuery);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchResults]);

  return { ...result, loading, refetch: () => fetchResults(searchQuery) };
};
