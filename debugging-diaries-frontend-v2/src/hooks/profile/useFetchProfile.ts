import { useState, useEffect, useCallback, useRef } from 'react';
import profileApi from '@/apis/profile/profileApi';
import type { UserProfile } from '@/types/api/profileTypes';
import useToast from '@/hooks/component/useToast';

export const useFetchProfile = (username: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const isInitialMount = useRef(true);

  const fetchProfile = useCallback(
    async (user: string) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await profileApi.getByUsername(user);
        setProfile(data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        showError(error?.response?.data?.message || 'Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    const delay = isInitialMount.current ? 0 : 300;
    isInitialMount.current = false;

    // setTimeout ব্যবহার করে ইভেন্ট লুপের মাধ্যমে কল করা হচ্ছে (ESLint Purity ফিক্স)
    const timer = setTimeout(() => {
      if (username) {
        fetchProfile(username);
      } else {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [username, fetchProfile]);

  return {
    profile,
    loading,
    refetch: () => username && fetchProfile(username),
  };
};
