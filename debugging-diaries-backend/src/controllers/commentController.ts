import { HttpConstants } from '@constants/allConstant.js';
import CommentService from '@services/commentService.js';
import type { Request, Response } from 'express';
import ResponseHandler from '@utils/responseHandler.js';
import { clearCachePattern } from '@utils/redisUtils.js';

const HttpStatus = HttpConstants.statusCode;

export default class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  CreateComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Authentication required to comment.');
    }
    const { storyId, body, parentId } = req.validatedBody;

    const commentData = {
      storyId,
      body,
      parentId: parentId || null,
    };

    const newComment = await this.commentService.createComment(commentData, userId);

    await clearCachePattern('stories:*');
    await clearCachePattern(`story:*/${storyId}*`);

    // ✅ নতুন কমেন্ট হলে সব স্টোরির লিস্ট এবং ঐ নির্দিষ্ট স্টোরির ক্যাশ ক্লিয়ার হবে
    await clearCachePattern('stories:*');
    await clearCachePattern(`story:*/${storyId}*`);

    // ✅ নতুন কমেন্ট হলে সব স্টোরির লিস্ট এবং ঐ নির্দিষ্ট স্টোরির ক্যাশ ক্লিয়ার হবে
    await clearCachePattern('stories:*');
    await clearCachePattern(`story:*/${storyId}*`);

    ResponseHandler.send(res, HttpStatus.CREATED.code, {
      message: 'Comment created successfully.',
      data: newComment,
    });
  };

  UpdateComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const commentId = req.validatedParams.id;
    const { body } = req.validatedBody;

    if (!userId) {
      throw new Error('Authentication required.');
    }

    if (isNaN(commentId)) {
      throw new Error('Invalid Comment ID provided.');
    }
    const updatedComment = await this.commentService.updateComment(commentId, body);

    await clearCachePattern('stories:*');
    if (updatedComment && updatedComment.storyId) {
      await clearCachePattern(`story:*/${updatedComment.storyId}*`);
    }

    ResponseHandler.send(res, HttpStatus.OK.code, {
      message: 'Comment updated successfully.',
      data: updatedComment,
    });
  };

  DeleteComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const commentId = req.validatedParams.id;

    if (!userId) {
      throw new Error('Authentication required.');
    }

    if (isNaN(commentId)) {
      throw new Error('Invalid Comment ID provided.');
    }

    const deletedComment = await this.commentService.softDeleteComment(commentId);

    await clearCachePattern('stories:*');
    if (deletedComment && deletedComment.storyId) {
      await clearCachePattern(`story:*/${deletedComment.storyId}*`);
    }

    ResponseHandler.send(res, HttpStatus.OK.code, {
      message: 'Comment deleted successfully.',
      data: deletedComment,
    });
  };
}
