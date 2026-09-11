import CommentRepository from '@repositories/commentRepository.js';
import type * as CommentDTO from '@dtos/commentDTO.js';

export default class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async getCommentByID(commentId: number) {
    return await this.commentRepository.getCommentByID(commentId);
  }

  async createComment(commentData: CommentDTO.CreateComment, userId: number) {
    return await this.commentRepository.createComment(commentData, userId);
  }

  async updateComment(id: number, body: string) {
    return await this.commentRepository.updateComment(id, body);
  }

  async softDeleteComment(id: number) {
    return await this.commentRepository.softDeleteComment(id);
  }
}
