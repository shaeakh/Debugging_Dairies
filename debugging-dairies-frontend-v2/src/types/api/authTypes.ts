import type { BaseUser, Role } from '@/types/api/userTypes';
import type { BaseSuccessResponse } from './CommonTypes';

export type SignUpRequest = Pick<BaseUser, 'username' | 'name' | 'email'> & {
  password: string;
  role?: Role;
};

export type SignInRequest = Pick<BaseUser, 'email'> & {
  password: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type VerifyOtpRequest = {
  type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
  code: string;
};

export type UserPayload = Pick<
  BaseUser,
  'id' | 'username' | 'name' | 'email' | 'role'
>;

export type SignInSuccessResponse = BaseSuccessResponse & {
  payload: UserPayload;
};

export type SignUpSuccessResponse = {
  message: string;
};
