import type { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

const body = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ParsedData = schema.safeParse(req.body);

    if (!ParsedData.success) {
      return next(ParsedData.error);
    }
    req.validatedBody = ParsedData.data;
    next();
  };
};

const params = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ParsedData = schema.safeParse(req.params);

    if (!ParsedData.success) {
      return next(ParsedData.error);
    }
    req.validatedParams = ParsedData.data;
    next();
  };
};

const query = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ParsedData = schema.safeParse(req.query);

    if (!ParsedData.success) {
      return next(ParsedData.error);
    }
    req.validatedQuery = ParsedData.data;
    next();
  };
};

export { body, params, query };
