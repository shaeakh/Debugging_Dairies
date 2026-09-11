import { useState } from 'react';
import voteApi from '@/apis/vote/voteApi';
import type { CommentVoteRequest, VoteResponse } from '@/types/api/voteTypes';
import useToast from '@/hooks/component/useToast';

export const useVoteComment = () => {
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  const voteComment = async (
    data: CommentVoteRequest,
    onSuccess?: (response: VoteResponse) => void
  ): Promise<VoteResponse | null> => {
    setLoading(true);
    try {
      const response = await voteApi.voteComment(data);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(
        error?.response?.data?.message || 'Failed to submit vote on comment.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { voteComment, loading };
};
