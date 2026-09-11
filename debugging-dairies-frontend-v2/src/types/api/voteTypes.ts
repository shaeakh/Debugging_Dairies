import type { BaseSuccessResponse } from './CommonTypes';

export type VoteType = 'UPVOTE' | 'DOWNVOTE';

export type BaseVote = {
  id: number;
  type: VoteType;
  userId: number;
};

export type Vote = Pick<BaseVote, 'id' | 'type' | 'userId'> & {
  storyId: number;
};

export type CommentVote = Pick<BaseVote, 'id' | 'type' | 'userId'> & {
  commentId: number;
};

export type StoryVoteRequest = Pick<Vote, 'storyId' | 'type'>;

export interface CommentVoteRequest {
  commentId: number;
  type: VoteType;
}

export interface VotePayload {
  success: boolean;
  action: 'VOTED' | 'UNVOTED' | 'CHANGED';
}

export type VoteResponse = BaseSuccessResponse & {
  payload: VotePayload;
};
