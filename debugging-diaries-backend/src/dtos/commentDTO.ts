import { z } from 'zod';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';

export const StoryCommentSchema = z.object({
  id: CommonItemDTO.IdSchema.shape.id,
  body: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  is_deleted: z.boolean(),
  deleted_at: z.coerce.date().nullable(),
  userId: CommonItemDTO.IdSchema.shape.id,
  storyId: CommonItemDTO.IdSchema.shape.id,
  parentId: CommonItemDTO.IdSchema.shape.id.nullable().optional(),
});

export const CreateCommentSchema = StoryCommentSchema.pick({
  body: true,
  storyId: true,
  parentId: true,
});
export const UpdateCommentSchema = StoryCommentSchema.pick({
  body: true,
});

export type StoryComment = z.infer<typeof StoryCommentSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
