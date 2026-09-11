import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type { UserProfile } from '@/types/api/profileTypes';

const profileApi = {
  getByUsername: async (username: string): Promise<UserProfile> => {
    const response = await api.get(ENDPOINTS.profile.getByUsername(username));
    return response.data?.data || response.data;
  },
};

export default profileApi;
