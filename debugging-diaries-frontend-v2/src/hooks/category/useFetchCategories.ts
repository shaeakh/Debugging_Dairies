import { useState, useEffect, useRef, useCallback } from 'react';
import categoryApi from '@/apis/category/categoryApi';
import type { Category } from '@/types/api/categoryTypes';
import useToast from '@/hooks/component/useToast';

export const useFetchCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const isInitialMount = useRef(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(Array.isArray(response) ? response : []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
};
