import storyApi from '@/apis/story/storyApi';
import useToast from '@/hooks/component/useToast';
import type { StoryUpdate } from '@/types/api/storyTypes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUpdateStory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const updateStory = async (id: number, data: StoryUpdate) => {
    setLoading(true);
    try {
      await storyApi.update(id, data);
      showSuccess('Story updated successfully!');
      navigate('/home');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(error?.response?.data?.message || 'Failed to update story');
    } finally {
      setLoading(false);
    }
  };

  return { updateStory, loading };
};
