import { z } from 'zod';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';

export const VoteTypeSchema = z.enum(['UPVOTE', 'DOWNVOTE']);

export const StoryVoteSchema = z.object({
  id: CommonItemDTO.IdSchema.shape.id,
  type: VoteTypeSchema,
  userId: CommonItemDTO.IdSchema.shape.id,
  storyId: CommonItemDTO.IdSchema.shape.id,
});

export const CommentVoteSchema = z.object({
  id: z.number().int().positive(),
  type: VoteTypeSchema,
  userId: z.number().int().positive(),
  commentId: z.number().int().positive(),
});

export const CreateStoryVoteSchema = StoryVoteSchema.pick({
  type: true,
  storyId: true,
});

export const CreateCommentVoteSchema = CommentVoteSchema.pick({
  type: true,
  commentId: true,
});

export type VoteType = z.infer<typeof VoteTypeSchema>;
export type StoryVote = z.infer<typeof StoryVoteSchema>;
