import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type {
  CreateCommentRequest,
  CreateCommentResponse,
} from '@/types/api/commentTypes';

const commentApi = {
  createComment: async (
    data: CreateCommentRequest
  ): Promise<CreateCommentResponse> => {
    const response = await api.post<CreateCommentResponse>(
      ENDPOINTS.comments.create,
      data
    );
    return response.data;
  },
};

export default commentApi;
