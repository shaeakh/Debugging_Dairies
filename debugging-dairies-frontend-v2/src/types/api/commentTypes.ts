import type { BaseUser } from '@/types/api/userTypes';
import type { BaseSuccessResponse } from './CommonTypes';

export type CommentAuthor = Pick<BaseUser, 'id' | 'username' | 'name'>;
export type Comment = {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  userId: number;
  storyId: number;
  parentId: number | null;
  user: CommentAuthor;
};
export type CreateCommentRequest = Pick<
  Comment,
  'storyId' | 'body' | 'parentId'
>;

export type CreateCommentResponse = BaseSuccessResponse & {
  payload: Comment;
};
