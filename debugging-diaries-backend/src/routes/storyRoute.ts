import StoryController from '@controllers/storyController.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import * as StoryDTO from '@dtos/storyDTO.js';
import authenticateToken from '@middlewares/authenticateToken.js';
import * as AuthrizeRole from '@middlewares/authorizeRoles.js';
import * as Validator from '@middlewares/requestValidator.js';
import express from 'express';
import { cacheMiddleware } from '@middlewares/redisCache.js';

const router = express.Router();
const storyController = new StoryController();

router
  .route('/')
  .all(authenticateToken)
  .get(
    Validator.query(StoryDTO.QuerySchema),
    cacheMiddleware('stories'),
    storyController.GetAllStories,
  )
  .post(Validator.body(StoryDTO.CreateSchema), storyController.CreateStory);

router
  .route('/:id')
  .all(Validator.params(CommonItemDTO.IdSchema), authenticateToken)
  .get(cacheMiddleware('story'), storyController.GetStoryByID)
  .patch(
    AuthrizeRole.storyAccess,
    Validator.body(StoryDTO.UpdateSchema),
    storyController.UpdateStory,
  )
  .delete(AuthrizeRole.storyAccess, storyController.RemoveStory);
export default router;
