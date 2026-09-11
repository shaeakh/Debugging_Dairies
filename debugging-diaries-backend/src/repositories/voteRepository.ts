import prisma from '@config/db.js';
import { VoteType } from '@prisma/client';

export class VoteRepository {
  constructor() {}

  getVote(userId: number, storyId: number) {
    return prisma.vote.findUnique({
      where: {
        userId_storyId: { userId, storyId },
      },
    });
  }

  createVote(userId: number, storyId: number, type: VoteType) {
    return prisma.vote.create({
      data: { userId, storyId, type },
    });
  }

  updateVote(userId: number, storyId: number, type: VoteType) {
    return prisma.vote.update({
      where: {
        userId_storyId: { userId, storyId },
      },
      data: { type },
    });
  }

  deleteVote(userId: number, storyId: number) {
    return prisma.vote.delete({
      where: {
        userId_storyId: { userId, storyId },
      },
    });
  }
}
