import * as StoryDTO from '@dtos/storyDTO.js';
import * as UserDTO from '@dtos/userDTO.js';
import { z } from 'zod';

export const UserProfileParamsSchema = z.object({
  username: UserDTO.UserSchema.shape.username,
});

export const ProfileSchema = UserDTO.UserSchema.extend({
  stories: z.array(StoryDTO.StoryWithAuthorSchema),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type UserProfileParams = z.infer<typeof UserProfileParamsSchema>;
