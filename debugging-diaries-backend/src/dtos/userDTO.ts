import { MessageConstants } from '@constants/allConstant.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import { z } from 'zod';
import * as StoryDTO from '@dtos/storyDTO.js';

const Message = MessageConstants.validation;

export const UserSchema = z.object({
  id: CommonItemDTO.IdSchema.shape.id,
  username: z.string().min(3, Message.username.minimumLength),
  name: z
    .string()
    .min(3, Message.name.minimumLength)
    .regex(/^[^0-9]*$/, Message.name.containsNumber),
  email: z.email(Message.email),
  role: z
    .enum(['USER', 'ADMIN'], {
      message: Message.role,
    })
    .default('USER'),
  join_date: z.coerce.date().default(() => new Date()),
  is_active: z.boolean().default(false),
  is_deleted: z.boolean().default(false),
  deleted_at: z.date().nullable().default(null),
});

export const CreateSchema = UserSchema.pick({
  username: true,
  name: true,
  email: true,
  role: true,
  join_date: true,
  is_active: true,
  is_deleted: true,
  deleted_at: true,
});

export const UpdateSchema = UserSchema.partial();

export const QuerySchema = CommonItemDTO.BaseQuerySchema;
export const UserProfileParamsSchema = z.object({
  username: UserSchema.shape.username,
});

export const UserProfileSchema = UserSchema.extend({
  stories: z.array(StoryDTO.StorySchema),
});

export type User = z.infer<typeof UserSchema>;
export type Create = z.infer<typeof CreateSchema>;
export type Update = z.infer<typeof UpdateSchema>;
export type UserQuery = z.infer<typeof QuerySchema>;
export type UserProfileParams = z.infer<typeof UserProfileParamsSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
