import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storyApi from '@/apis/story/storyApi';
import type { StoryCreate } from '@/types/api/storyTypes';
import useToast from '@/hooks/component/useToast';

export const useCreateStory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const createStory = async (data: StoryCreate) => {
    setLoading(true);
    try {
      await storyApi.create(data);
      showSuccess('Story created successfully!');
      navigate('/home');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return { createStory, loading };
};
