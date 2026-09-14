import type { BaseUser } from './userTypes';
import type { Story } from './storyTypes';
import type { PaginationParams } from './CommonTypes';

export interface SearchQueryParams extends PaginationParams {
  search: string;
}

export interface SearchResult {
  users: BaseUser[];
  stories: Story[];
}

export interface SearchResponse {
  data: SearchResult;
}
