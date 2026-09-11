import VoteController from '@controllers/voteController.js';
import authenticateToken from '@middlewares/authenticateToken.js';
import express from 'express';
import * as Validator from '@middlewares/requestValidator.js';
import * as VoteDTO from '@dtos/voteDTO.js';

const router = express.Router();
const voteController = new VoteController();

router
  .route('/story')
  .post(authenticateToken, Validator.body(VoteDTO.CreateStoryVoteSchema), voteController.VoteStory);

router
  .route('/comment')
  .post(
    authenticateToken,
    Validator.body(VoteDTO.CreateCommentVoteSchema),
    voteController.VoteComment,
  );

export default router;
