import { useState } from 'react';
import commentApi from '@/apis/comment/commentApi';
import type {
  CreateCommentRequest,
  CreateCommentResponse,
} from '@/types/api/commentTypes';
import useToast from '@/hooks/component/useToast';

export const useCreateComment = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const createComment = async (
    data: CreateCommentRequest,
    onSuccess?: (response: CreateCommentResponse) => void
  ): Promise<CreateCommentResponse | null> => {
    setLoading(true);
    try {
      const response = await commentApi.createComment(data);

      // Show success message (e.g., "Comment created successfully.")
      showSuccess(response.message || 'Comment posted successfully!');

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(
        error?.response?.data?.message ||
          'Failed to post your comment. Please try again.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createComment, loading };
};
