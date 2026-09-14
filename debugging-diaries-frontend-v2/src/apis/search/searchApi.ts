import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type {
  SearchQueryParams,
  SearchResponse,
  SearchResult,
} from '@/types/api/searchTypes';

const searchApi = {
  search: async (params: SearchQueryParams): Promise<SearchResult> => {
    const response = await api.get<SearchResponse>(ENDPOINTS.search.search, {
      params,
    });
    return response.data?.data || response.data;
  },
};

export default searchApi;
