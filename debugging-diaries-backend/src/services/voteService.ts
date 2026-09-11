import StoryService from '@services/storyService.js';
import { VoteRepository } from '@repositories/voteRepository.js';
import { VoteType } from '@prisma/client';
import CommentVoteRepository from '@repositories/commentVoteRepository.js';
// Note: You may want to import your CommentService here to verify comment existence,
// depending on whether you have a safety check setup for comments like you do for stories.

export class VoteService {
  private storyService: StoryService;

  private commentVoteRepository: CommentVoteRepository;

  private voteRepo: VoteRepository;

  constructor() {
    this.storyService = new StoryService();
    this.voteRepo = new VoteRepository();
    this.commentVoteRepository = new CommentVoteRepository();
  }

  async voteStory(userId: number, storyId: number, targetType: VoteType) {
    // 1. Safety Check: Verify the story exists and isn't soft-deleted
    await this.storyService.GetStoryByID(storyId);
    // 2. Fetch the user's current vote status for this story
    const existingVote = await this.voteRepo.getVote(userId, storyId);

    // Case A: The user has already voted on this story before
    if (existingVote) {
      if (existingVote.type === targetType) {
        // User clicked the exact same button again -> Remove the vote (un-vote)
        await this.voteRepo.deleteVote(userId, storyId);

        return {
          success: true,
          action: 'UNVOTED', // UI should reverse the previous vote contribution
        };
      } else {
        // User clicked the opposite button -> Flip the vote type
        await this.voteRepo.updateVote(userId, storyId, targetType);

        return {
          success: true,
          action: 'CHANGED', // UI should adjust the score counter by 2 units
        };
      }
    }

    // Case B: Brand new interaction (No existing vote row found)
    await this.voteRepo.createVote(userId, storyId, targetType);

    return {
      success: true,
      action: 'VOTED', // UI should adjust the score counter by 1 unit
    };
  }

  async voteComment(userId: number, commentId: number, targetType: VoteType) {
    // 1. Fetch the user's current vote status for this comment
    const existingVote = await this.commentVoteRepository.getCommentVote(userId, commentId);

    // Case A: The user has already voted on this comment before
    if (existingVote) {
      if (existingVote.type === targetType) {
        // User clicked the exact same button again -> Remove the vote (un-vote)
        await this.commentVoteRepository.deleteCommentVote(userId, commentId);

        return {
          success: true,
          action: 'UNVOTED', // UI should reverse the previous vote contribution
        };
      } else {
        // User clicked the opposite button -> Flip the vote type
        // This utilizes the upsert (or update equivalent) method built into your repo
        await this.commentVoteRepository.upsertCommentVote(userId, commentId, targetType);

        return {
          success: true,
          action: 'CHANGED', // UI should adjust the score counter by 2 units
        };
      }
    }

    // Case B: Brand new interaction (No existing vote row found)
    await this.commentVoteRepository.createCommentVote(userId, commentId, targetType);

    return {
      success: true,
      action: 'VOTED', // UI should adjust the score counter by 1 unit
    };
  }
}
