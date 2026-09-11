import UserService from '@services/userService.js';
import StoryService from '@services/storyService.js';
import type { Request, Response, NextFunction } from 'express';
import * as Error from '@errors/concreteErrors.js';
import CommentService from '@services/commentService.js';

const userService = new UserService();
const storyService = new StoryService();
const commentService = new CommentService();

export const userAccess = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new Error.AuthenticationError('Credential Required'));
  }
  const freshUser = await userService.GetUserByID(req.user.id);

  if (!freshUser) {
    return next(new Error.AuthenticationError('Invalid credential'));
  }

  if (freshUser.role === 'ADMIN') {
    return next();
  }
  if (
    freshUser.id !== req.validatedParams?.id &&
    freshUser.username !== req.validatedParams?.username
  ) {
    throw new Error.AuthorizationError('You can only update your account');
  }
  next();
};

export const storyAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user!;
  // story checking part
  const paramData = req.validatedParams.id;
  const story = await storyService.GetStoryByID(paramData);

  if (!story) {
    throw new Error.NotFoundError("Story doesn't exist");
  }

  // user authorization part
  const freshUser = await userService.GetUserByID(id);

  if (!freshUser) {
    return next(new Error.AuthenticationError('Invalid credential'));
  }

  if (freshUser.role === 'ADMIN') {
    return next();
  }

  const author = await userService.GetUserByID(story.userId);

  if (author?.id !== id) {
    throw new Error.AuthorizationError('You can only modify your stories');
  }
  next();
};

export const commentAccess = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user!;

  const commentId = req.validatedParams.id;

  if (isNaN(commentId)) {
    throw new Error.NotFoundError('Invalid comment ID');
  }

  const comment = await commentService.getCommentByID(commentId);

  if (!comment) {
    throw new Error.NotFoundError("Comment doesn't exist");
  }

  // user authorization part
  const freshUser = await userService.GetUserByID(id);

  if (!freshUser) {
    return next(new Error.AuthenticationError('Invalid credential'));
  }

  if (freshUser.role === 'ADMIN') {
    return next();
  }

  if (comment.userId !== id) {
    throw new Error.AuthorizationError('You can only modify your comments');
  }

  next();
};
