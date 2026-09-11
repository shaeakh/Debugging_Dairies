import type { Request, Response, NextFunction } from 'express';
import { BaseError } from '@errors/baseErrorClass.js';
import { ZodError } from 'zod';
import { EnvConstant } from '@constants/allConstant.js';
import ResponseHandler from '@utils/responseHandler.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined;

  if (err instanceof BaseError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((e) => e.message).join(', ');
  }

  if (EnvConstant.NODE_ENV === 'development' && err instanceof Error) {
    stack = err.stack;
  }
  ResponseHandler.send(res, statusCode, { message, stack });
};

export default errorHandler;
