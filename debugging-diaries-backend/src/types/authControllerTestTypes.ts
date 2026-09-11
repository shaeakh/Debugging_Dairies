import type { SignUp, SignIn, ChangePassword, VerifyOtp, AuthPayload } from '@dtos/authDTO.js';
import { vi } from 'vitest';
import type { Request } from 'express';

type MockedAuthService = {
  SignUp: ReturnType<typeof vi.fn>;
  ConfirmEmail: ReturnType<typeof vi.fn>;
  SignIn: ReturnType<typeof vi.fn>;
  ChangePassword: ReturnType<typeof vi.fn>;
  VerifyOtp: ReturnType<typeof vi.fn>;
};

type ValidatedBody = SignUp | SignIn | ChangePassword | VerifyOtp;

type MockRequest = Omit<Request, 'validatedBody' | 'user'> & {
  validatedBody: ValidatedBody;
  user: AuthPayload;
};

export type { MockedAuthService, ValidatedBody, MockRequest };
