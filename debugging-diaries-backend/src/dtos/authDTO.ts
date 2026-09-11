import { MessageConstants } from '@constants/allConstant.js';
import { z } from 'zod';
import * as UserDTO from '@dtos/userDTO.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';

const Message = MessageConstants.validation;

export const signUpSchema = UserDTO.UserSchema.pick({
  username: true,
  name: true,
  email: true,
}).extend({
  password: z
    .string()
    .min(8, Message.password.minimumLength)
    .max(32, Message.password.maximumLength)
    .regex(/[A-Z]/, Message.password.containsUpperCase)
    .regex(/[a-z]/, Message.password.containsLowerCase)
    .regex(/[0-9]/, Message.password.containsNumber)
    .regex(/[^A-Za-z0-9]/, Message.password.containsSpecialCharacter),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});

// export const confirmationPayloadSchema = UserDTO.UserSchema.pick({
//   id: true,
//   email: true,
// });

export const authPayloadSchema = UserDTO.UserSchema.pick({
  id: true,
  username: true,
  email: true,
  name: true,
  role: true,
});
export const authResponseSchema = z.object({
  token: z.string(),
});
export const changePasswordSchma = z.object({
  currentPassword: signUpSchema.shape.password,
  newPassword: signUpSchema.shape.password,
});
export const otpSchema = z.object({
  id: CommonItemDTO.IdSchema.shape.id,
  userId: CommonItemDTO.IdSchema.shape.id,
  code: z.string().length(6),
  temporary_password: signUpSchema.shape.password.nullable().default(null),
  type: z.enum(['PASSWORD_RESET', 'EMAIL_VERIFICATION']),
  created_at: z.date().default(() => new Date()),
  expires_at: z.date().default(() => new Date(Date.now() + 5 * 60 * 1000)),
});
export const createOtpSchema = otpSchema.pick({
  userId: true,
  code: true,
  temporary_password: true,
  type: true,
  created_at: true,
  expires_at: true,
});
export const verifyOtpSchema = z.object({
  type: otpSchema.shape.type,
  code: otpSchema.shape.code,
});

export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type AuthPayload = z.infer<typeof authPayloadSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchma>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
export type Otp = z.infer<typeof otpSchema>;
export type Otp_type = z.infer<typeof otpSchema.shape.type>;
export type CreateOtp = z.infer<typeof createOtpSchema>;
