import prisma from '@config/db.js';
import { VoteType } from '@prisma/client';

export default class CommentVoteRepository {
  constructor() {}

  async getCommentVote(userId: number, commentId: number) {
    return await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
  }

  async createCommentVote(userId: number, commentId: number, type: VoteType) {
    return await prisma.commentVote.create({
      data: {
        userId,
        commentId,
        type,
      },
    });
  }

  async upsertCommentVote(userId: number, commentId: number, type: VoteType) {
    return await prisma.commentVote.upsert({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
      update: {
        type,
      },
      create: {
        userId,
        commentId,
        type,
      },
    });
  }

  async deleteCommentVote(userId: number, commentId: number) {
    return await prisma.commentVote.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
  }
}
