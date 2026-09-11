import { HttpConstants } from '@constants/allConstant.js';
import { VoteService } from '@services/voteService.js';
import type { Request, Response } from 'express';
import ResponseHandler from '@utils/responseHandler.js';
import { clearCachePattern } from '@utils/redisUtils.js';

const HttpStatus = HttpConstants.statusCode;

export default class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  VoteStory = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { type, storyId } = req.validatedBody;

    if (!userId) {
      throw new Error('Authentication required to vote.');
    }
    const result = await this.voteService.voteStory(userId, storyId, type);

    // Invalidate caches so the updated score shows up instantly
    await clearCachePattern('stories:*');
    await clearCachePattern(`story:*/${storyId}*`);

    ResponseHandler.send(res, HttpStatus.OK.code, {
      message: `Story successfully ${result.action.toLowerCase()}.`,
      data: result,
    });
  };

  VoteComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { type, commentId } = req.validatedBody; // e.g., 'UPVOTE' or 'DOWNVOTE'

    if (!userId) {
      throw new Error('Authentication required to vote.');
    }

    const result = await this.voteService.voteComment(userId, commentId, type);

    // Invalidate comment or story caches where this comment might reside
    await clearCachePattern('comments:*');
    await clearCachePattern('stories:*');

    ResponseHandler.send(res, HttpStatus.OK.code, {
      message: `Comment successfully ${result.action.toLowerCase()}.`,
      data: result,
    });
  };
}
