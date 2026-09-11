/* eslint-disable @typescript-eslint/no-explicit-any */
import 'express';
import * as AuthDTO from '@dtos/authDTO.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthDTO.AuthPayload;
    validatedBody?: any;
    validatedParams?: any;
    validatedQuery?: any;
  }
}
