import { useState } from 'react';
import storyApi from '@/apis/story/storyApi';
import useToast from '@/hooks/component/useToast';

export const useDeleteStory = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  const deleteStory = async (id: number) => {
    setIsDeleting(true);
    try {
      const response = await storyApi.delete(id);
      showSuccess(response.message || 'Story deleted successfully');

      if (onSuccess) {
        onSuccess();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Failed to delete story');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteStory, isDeleting };
};
