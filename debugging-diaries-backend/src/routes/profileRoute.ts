import ProfileController from '@controllers/profileController.js';
import * as ProfileDTO from '@dtos/profileDTO.js';
import authenticateToken from '@middlewares/authenticateToken.js';
import * as Validator from '@middlewares/requestValidator.js';
import { cacheMiddleware } from '@middlewares/redisCache.js';
import express from 'express';

const router = express.Router();
const profileController = new ProfileController();

router.get(
  '/:username',
  Validator.params(ProfileDTO.UserProfileParamsSchema),
  authenticateToken,
  cacheMiddleware('profile'),
  profileController.GetUserProfile,
);

export default router;
