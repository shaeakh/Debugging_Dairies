import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type { Category } from '@/types/api/categoryTypes';

const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(ENDPOINTS.categories.getAll);
    return response.data;
  },
  create: async (name: string): Promise<Category> => {
    const response = await api.post<Category>(ENDPOINTS.categories.create, {
      name,
    });
    return response.data;
  },
  getTrending: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(ENDPOINTS.categories.trending);
    return response.data;
  },
};

export default categoryApi;
