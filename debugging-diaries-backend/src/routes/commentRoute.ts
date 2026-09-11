import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import CommentController from '@controllers/commentController.js';
import authenticateToken from '@middlewares/authenticateToken.js';
import express from 'express';
import * as Validator from '@middlewares/requestValidator.js';
import * as CommentDTO from '@dtos/commentDTO.js';
import { commentAccess } from '@middlewares/authorizeRoles.js';

const router = express.Router();
const commentController = new CommentController();

router
  .route('/')
  .post(
    authenticateToken,
    Validator.body(CommentDTO.CreateCommentSchema),
    commentController.CreateComment,
  );

router
  .route('/:id')
  .all(Validator.params(CommonItemDTO.IdSchema))
  .patch(
    authenticateToken,
    Validator.body(CommentDTO.UpdateCommentSchema),
    commentAccess,
    commentController.UpdateComment,
  )
  .delete(authenticateToken, commentAccess, commentController.DeleteComment);

export default router;
