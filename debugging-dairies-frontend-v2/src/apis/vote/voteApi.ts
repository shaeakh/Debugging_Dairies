import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type {
  StoryVoteRequest,
  CommentVoteRequest,
  VoteResponse,
} from '@/types/api/voteTypes';

const voteApi = {
  voteStory: async (data: StoryVoteRequest): Promise<VoteResponse> => {
    const response = await api.post<VoteResponse>(ENDPOINTS.votes.story, data);
    return response.data;
  },
  voteComment: async (data: CommentVoteRequest): Promise<VoteResponse> => {
    const response = await api.post<VoteResponse>(
      ENDPOINTS.votes.comment,
      data
    );
    return response.data;
  },
};

export default voteApi;
