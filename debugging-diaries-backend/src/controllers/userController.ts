import UserService from '@services/userService.js';
import { HttpConstants, MessageConstants } from '@constants/allConstant.js';
import type { Request, Response } from 'express';
import { clearCachePattern } from '@utils/redisUtils.js';

const HttpStatus = HttpConstants.statusCode;
const Message = MessageConstants.responseMessage.userController;

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  GetAllUsers = async (req: Request, res: Response) => {
    const queryData = req.validatedQuery;
    const users = await this.userService.GetAllUsers(queryData);

    res.status(HttpStatus.OK.code).json(users);
  };

  GetUserByID = async (req: Request, res: Response) => {
    const id = req.validatedParams.id;
    const user = await this.userService.GetUserByID(id);

    res.status(HttpStatus.OK.code).json(user);
  };

  UpdateUser = async (req: Request, res: Response) => {
    const id = req.validatedParams.id;
    const user = req.validatedBody;
    const updatedUser = await this.userService.UpdateUser(id, user);

    await clearCachePattern('users:*');
    await clearCachePattern(`user:*/${id}*`);
    await clearCachePattern('profile:*');

    res.status(HttpStatus.OK.code).json(updatedUser);
  };

  RemoveUser = async (req: Request, res: Response) => {
    const id = req.validatedParams.id;

    await this.userService.RemoveUser(id);

    await clearCachePattern('users:*');
    await clearCachePattern(`user:*/${id}*`);
    await clearCachePattern('profile:*');

    res.status(HttpStatus.OK.code).json({ message: Message.userRemoved });
  };
}
