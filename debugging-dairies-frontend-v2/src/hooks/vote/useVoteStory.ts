import { useState } from 'react';
import voteApi from '@/apis/vote/voteApi';
import type { StoryVoteRequest, VoteResponse } from '@/types/api/voteTypes';
import useToast from '@/hooks/component/useToast';

export const useVoteStory = () => {
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  const voteStory = async (
    data: StoryVoteRequest,
    onSuccess?: (response: VoteResponse) => void
  ): Promise<VoteResponse | null> => {
    setLoading(true);
    try {
      const response = await voteApi.voteStory(data);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showError(
        error?.response?.data?.message || 'Failed to submit vote on story.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { voteStory, loading };
};
