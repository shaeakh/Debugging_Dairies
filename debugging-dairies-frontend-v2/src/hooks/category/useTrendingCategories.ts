import { useState, useEffect, useCallback, useRef } from 'react';
import categoryApi from '@/apis/category/categoryApi';
import type { Category } from '@/types/api/categoryTypes';
import useToast from '@/hooks/component/useToast';

export const useTrendingCategories = () => {
  const [trendingCategories, setTrendingCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const isInitialMount = useRef(true);

  const fetchTrendingCategories = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setLoading(true);
      }
      try {
        const response = await categoryApi.getTrending();
        const data = (response || []) as Category[];
        setTrendingCategories(data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        showError(
          error?.response?.data?.message || 'Failed to load trending topics'
        );
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchTrendingCategories(false);
    }
  }, [fetchTrendingCategories]);

  const handleRefresh = useCallback(() => {
    fetchTrendingCategories(true);
  }, [fetchTrendingCategories]);

  return {
    trendingCategories,
    loading,
    refresh: handleRefresh,
  };
};
