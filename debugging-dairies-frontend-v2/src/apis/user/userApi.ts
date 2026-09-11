import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type { BaseSuccessResponse } from '@/types/api/CommonTypes';
import type { BaseUser, UserUpdate } from '@/types/api/userTypes';
import type { PaginationParams } from '@/types/api/CommonTypes';

interface SingleUserResponse {
  data: BaseUser;
}

interface MultiUserResponse {
  data: BaseUser[];
}

const userApi = {
  getAll: async (params?: PaginationParams): Promise<BaseUser[]> => {
    const response = await api.get<MultiUserResponse>(ENDPOINTS.users.getAll, {
      params,
    });
    return response.data?.data || response.data;
  },
  getById: async (id: number): Promise<BaseUser> => {
    const response = await api.get<SingleUserResponse>(
      ENDPOINTS.users.getById(id)
    );
    return response.data?.data || response.data;
  },
  update: async (id: number, data: UserUpdate): Promise<BaseUser> => {
    // Note: Backend userRoute.ts uses .patch() for updates
    const response = await api.patch<SingleUserResponse>(
      ENDPOINTS.users.update(id),
      data
    );
    return response.data?.data || response.data;
  },

  delete: async (id: number): Promise<BaseSuccessResponse> => {
    const response = await api.delete<BaseSuccessResponse>(
      ENDPOINTS.users.delete(id)
    );
    return response.data;
  },
};

export default userApi;
