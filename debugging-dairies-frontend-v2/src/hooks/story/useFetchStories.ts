import { useState, useEffect, useCallback, useRef } from 'react';
import storyApi from '@/apis/story/storyApi';
import type { Story } from '@/types/api/storyTypes';
import useToast from '@/hooks/component/useToast';

export const useFetchStories = (page = 1, limit = 4) => {
  const [stories, setStories] = useState<Story[]>([]);
  // ডিফল্ট স্টেট true রাখলে মাউন্টের সময় সিনক্রোনাসলি আবার setLoading(true) কল করতে হয় না
  const [loading, setLoading] = useState(true);
  const [totalStories, setTotalStories] = useState(0);
  const { showError } = useToast();

  // ১. আনইউজড ভ্যারিয়েবল ফিক্স করা হলো (এখন ইফেক্টে ব্যবহার হবে)
  const isInitialMount = useRef(true);

  const fetchStories = useCallback(
    async (isRefresh = false) => {
      // কেবল ম্যানুয়াল রিফ্রেশ বা পেজ চেঞ্জের সময় লোডিং ট্রু হবে
      if (isRefresh) {
        setLoading(true);
      }
      try {
        const response = await storyApi.getAll({ page, limit });
        setStories(response.stories || []);
        setTotalStories(response.metaData?.total || 0);
        // ২. no-explicit-any ফিক্স করতে err: unknown ব্যবহার করে টাইপ কাস্টিং করা হয়েছে
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        showError(error?.response?.data?.message || 'Failed to load stories');
      } finally {
        setLoading(false);
      }
    },
    [page, limit, showError]
  );

  // ৩. ক্যাস্কেডিং রেন্ডার লুপ ফিক্স করা হলো
  useEffect(() => {
    if (isInitialMount.current) {
      // প্রথমবার মাউন্ট হলে অলরেডি loading=true আছে, তাই এক্সট্রা স্টেট চেইঞ্জের দরকার নেই
      isInitialMount.current = false;
      fetchStories(false);
    } else {
      // পরবর্তী সময়ে পেজ বা লিমিট চেঞ্জ হলে ট্রু দিয়ে ডেটা রিফেচ হবে
      fetchStories(true);
    }
  }, [fetchStories]);

  const handleRefresh = useCallback(() => {
    fetchStories(true);
  }, [fetchStories]);

  return {
    stories,
    loading,
    totalStories,
    refresh: handleRefresh,
  };
};
