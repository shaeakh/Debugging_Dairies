import type { Story } from './storyTypes';
import type { BaseUser } from './userTypes';

export type UserProfile = Pick<
  BaseUser,
  | 'id'
  | 'username'
  | 'name'
  | 'email'
  | 'join_date'
  | 'role'
  | 'is_active'
  | 'is_deleted'
  | 'deleted_at'
> & {
  stories: Story[];
};
