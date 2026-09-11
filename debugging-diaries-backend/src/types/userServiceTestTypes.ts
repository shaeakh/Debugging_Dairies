import { vi } from 'vitest';

type MockRepositoryInstance = {
  FindByUsernameOrEmail: ReturnType<typeof vi.fn>;
  CreateUser: ReturnType<typeof vi.fn>;
  GetAllUsers: ReturnType<typeof vi.fn>;
  GetUserByID: ReturnType<typeof vi.fn>;
  UpdateUser: ReturnType<typeof vi.fn>;
  RemoveUser: ReturnType<typeof vi.fn>;
  DeleteUser: ReturnType<typeof vi.fn>;
  SearchUser: ReturnType<typeof vi.fn>;
  GetProfileByUsername: ReturnType<typeof vi.fn>;
  UpdateProfileByUsername: ReturnType<typeof vi.fn>;
};
export type { MockRepositoryInstance };
