import type { Category } from './categoryTypes';
import type { BaseUser } from './userTypes';
import type { Comment } from './commentTypes';
import type { Vote } from './voteTypes';
export type Story = {
  id: number;
  title: string;
  body: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  userId: number;
  // Relations
  user: BaseUser;
  categories?: Category[];
  comments: Comment[];
  votes: Vote[];
};

export type GetAllStoriesResponse = {
  stories: Story[];
  metaData: {
    total: number;
  };
};

export type StoryCreate = Pick<Story, 'title' | 'body' | 'categories'>;
export type StoryUpdate = Partial<Pick<Story, 'title' | 'body' | 'categories'>>;
export type MetaData = {
  total: number;
};
