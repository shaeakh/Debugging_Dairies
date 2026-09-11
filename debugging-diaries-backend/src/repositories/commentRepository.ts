import prisma from '@config/db.js';
import type * as CommentDTO from '@dtos/commentDTO.js';

export default class CommentRepository {
  async getCommentByID(commentId: number) {
    return await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }

  async createComment(comment: CommentDTO.CreateComment, userId: number) {
    return await prisma.comment.create({
      data: {
        userId,
        ...comment,
      },
      include: {
        user: {
          select: { id: true, username: true, name: true },
        },
      },
    });
  }

  //   async getCommentsByStoryId(storyId: number) {
  //     return await prisma.comment.findMany({
  //       where: {
  //         storyId,
  //         parentId: null, // Fetch only parent comments, not replies
  //         is_deleted: false, // Don't fetch soft-deleted comments
  //       },
  //       include: {
  //         user: {
  //           select: { id: true, username: true, name: true },
  //         },
  //         _count: {
  //           select: { replies: true }, // Helpful for UI to show "View 3 Replies"
  //         },
  //         votes: true,
  //       },
  //       orderBy: {
  //         created_at: 'desc', // Newest first
  //       },
  //     });
  //   }

  //   async getRepliesByCommentId(commentId: number) {
  //     return await prisma.comment.findMany({
  //       where: {
  //         parentId: commentId,
  //         is_deleted: false,
  //       },
  //       include: {
  //         user: {
  //           select: { id: true, username: true, name: true },
  //         },
  //         votes: true,
  //       },
  //       orderBy: {
  //         created_at: 'asc',
  //       },
  //     });
  //   }

  async updateComment(id: number, body: string) {
    return await prisma.comment.update({
      where: { id },
      data: { body },
      include: {
        user: { select: { id: true, username: true } },
      },
    });
  }

  async softDeleteComment(id: number) {
    return await prisma.comment.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
        body: '[This comment has been deleted]', // Optional: wipe the body text
      },
    });
  }

  async hardDeleteComment(id: number) {
    return await prisma.comment.delete({
      where: { id },
    });
  }
}
