import { z } from 'zod';
import { BaseQuerySchema } from '@dtos/commonItemDTO.js';
import { UserSchema } from './userDTO.js';
import { StoryWithAuthorSchema } from './storyDTO.js';

export const QuerySchema = BaseQuerySchema.extend({
  search: z.string(),
});

export const UserResponseSchema = UserSchema;

export const StoryResponseSchema = StoryWithAuthorSchema;

export const SearchResponseSchema = z.object({
  users: z.array(UserResponseSchema),
  stories: z.array(StoryResponseSchema),
});

export type Query = z.infer<typeof QuerySchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type StoryResponse = z.infer<typeof StoryResponseSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
