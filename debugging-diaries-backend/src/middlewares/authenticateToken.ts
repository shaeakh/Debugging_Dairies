import jwt from 'jsonwebtoken';
import { MessageConstants } from '@constants/allConstant.js';
import { EnvConstant } from '@constants/allConstant.js';
import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import * as Error from '@errors/concreteErrors.js';
import * as AuthDTO from 'dtos/authDTO.js';

const Message = MessageConstants.errorMessage.authService;

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET = EnvConstant.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error.AuthenticationError(Message.invalidCredential);
  }
  let token: string = '';

  if (!req.cookies.authToken) {
    return next(new Error.AuthenticationError('Invalid Credentials'));
  } else {
    token = req.cookies.authToken;
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = payload as AuthDTO.AuthPayload;
    next();
  }
};

export default authenticateToken;
