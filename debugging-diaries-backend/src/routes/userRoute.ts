import express from 'express';
import UserController from '@controllers/userController.js';
import authenticateToken from '@middlewares/authenticateToken.js';
import * as Validator from '@middlewares/requestValidator.js';
import * as UserDTO from '@dtos/userDTO.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';
import * as AuthrizeRole from '@middlewares/authorizeRoles.js';
import { cacheMiddleware } from '@middlewares/redisCache.js';

const router = express.Router();
const userController = new UserController();

router
  .route('/')
  .all(authenticateToken)
  .get(Validator.query(UserDTO.QuerySchema), cacheMiddleware('users'), userController.GetAllUsers);

router
  .route('/:id')
  .all(Validator.params(CommonItemDTO.IdSchema), authenticateToken)
  .get(cacheMiddleware('user'), userController.GetUserByID)
  .patch(AuthrizeRole.userAccess, Validator.body(UserDTO.UpdateSchema), userController.UpdateUser)
  .delete(AuthrizeRole.userAccess, userController.RemoveUser);

export default router;
