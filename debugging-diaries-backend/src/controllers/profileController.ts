import { HttpConstants } from '@constants/allConstant.js';
import UserService from '@services/userService.js';
import type { Request, Response } from 'express';

const HttpStatus = HttpConstants.statusCode;

export default class ProfileController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  GetUserProfile = async (req: Request, res: Response) => {
    const { username } = req.params as { username: string };
    const profile = await this.userService.GetProfileByUsername(username);

    res.status(HttpStatus.OK.code).json(profile);
  };
}
