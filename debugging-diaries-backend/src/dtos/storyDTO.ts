import { MessageConstants } from '@constants/allConstant.js';
import * as CategoryDTO from '@dtos/categoryDTO.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import { z } from 'zod';
import { StoryVoteSchema } from '@dtos/voteDTO.js';
import { StoryCommentSchema } from '@dtos/commentDTO.js';

const Message = MessageConstants.validation;

export const author = z.object({
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

export const StorySchema = z.object({
  id: CommonItemDTO.IdSchema.shape.id,
  title: z.string().min(10, Message.storyTitle.min).max(100, Message.storyTitle.max),
  body: z.string().min(20, Message.storyBody.min),
  summary: z.string().nullable().default(null),
  is_deleted: z.boolean().default(false),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
  deleted_at: z.date().nullable().default(null),
  userId: CommonItemDTO.IdSchema.shape.id,
  categories: z.array(CategoryDTO.CategorySchema).default([]),
  votes: z.array(StoryVoteSchema).default([]),
  comments: z.array(StoryCommentSchema).default([]),
});

export const StoryWithAuthorSchema = StorySchema.extend({
  user: author,
});

export const CreateSchema = StorySchema.pick({
  title: true,
  body: true,
  is_deleted: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  categories: true,
  summary: true,
});

export const UpdateSchema = StorySchema.pick({
  body: true,
  title: true,
  categories: true,
  summary: true,
}).partial();

export const ResponseSchema = StorySchema.pick({
  id: true,
  title: true,
  body: true,
  summary: true,
  is_deleted: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  userId: true,
  categories: true,
  votes: true,
  comments: true,
});

export const QuerySchema = CommonItemDTO.BaseQuerySchema;
export type Story = z.infer<typeof StorySchema>;
export type Create = z.infer<typeof CreateSchema> & {
  userId: z.infer<typeof StorySchema>['userId'];
};

export type Update = z.infer<typeof UpdateSchema>;
export type Response = z.infer<typeof ResponseSchema>;
export type Query = z.infer<typeof QuerySchema>;
export type StoryWithAuthor = z.infer<typeof StoryWithAuthorSchema>;
