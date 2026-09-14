import { useState, useEffect, useCallback, useRef } from 'react';
import storyApi from '@/apis/story/storyApi';
import type { Story } from '@/types/api/storyTypes';
import useToast from '@/hooks/component/useToast';

export const useFetchStoryById = (id: number | undefined) => {
  const [story, setStory] = useState<Story | null>(null);
  // ডিফল্টভাবে ট্রু রাখা হয়েছে যাতে ইনিশিয়াল রেন্ডারে সিনক্রোনাস আপডেটের লুপ না চলে
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  // ইনিশিয়াল মাউন্ট ট্র্যাক করার জন্য রিঅ্যাক্ট-সেফ গার্ড
  const isInitialMount = useRef(true);

  const fetchStory = useCallback(
    async (isManualRefetch = false) => {
      if (!id) return;

      // শুধুমাত্র ম্যানুয়াল রিফেচের সময় স্টেট চেঞ্জ ট্রিগার হবে
      if (isManualRefetch) {
        setLoading(true);
      }

      try {
        const data = await storyApi.getById(id);
        setStory(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        showError(err?.response?.data?.message || 'Failed to load the story');
      } finally {
        setLoading(false);
      }
    },
    [id, showError]
  );

  useEffect(() => {
    // শুধুমাত্র মাউন্টের সময় একবারই রান হবে, ফলে ক্যাস্কেডিং রেন্ডারের ভয় থাকবে না
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchStory();
    }
  }, [fetchStory]);

  // ম্যানুয়াল রিফেচকে মেমোইজ করে রিটার্ন করা হচ্ছে
  const handleRefetch = useCallback(() => {
    fetchStory(true);
  }, [fetchStory]);

  return {
    story,
    loading,
    refetch: handleRefetch,
  };
};
