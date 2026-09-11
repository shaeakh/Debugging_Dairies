import { vi } from 'vitest';

type MockAuthRepository = {
  CheckUserExists: ReturnType<typeof vi.fn>;
  SignUp: ReturnType<typeof vi.fn>;
  SignIn: ReturnType<typeof vi.fn>;
  GetAuthByUser: ReturnType<typeof vi.fn>;
  CreateOtp: ReturnType<typeof vi.fn>;
  GetOtp: ReturnType<typeof vi.fn>;
  UpdatePassword: ReturnType<typeof vi.fn>;
  DeleteOtp: ReturnType<typeof vi.fn>;
};

type MockUserService = {
  CreateUser: ReturnType<typeof vi.fn>;
  UpdateUser: ReturnType<typeof vi.fn>;
  DeleteUser: ReturnType<typeof vi.fn>;
};

type MockEmailUtils = {
  signUp: ReturnType<typeof vi.fn>;
  confirmEmail: ReturnType<typeof vi.fn>;
  sendOtp: ReturnType<typeof vi.fn>;
};

export type { MockAuthRepository, MockUserService, MockEmailUtils };
