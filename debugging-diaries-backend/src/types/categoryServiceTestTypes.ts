import { vi } from 'vitest';

type MockRepositoryInstance = {
  CreateCategory: ReturnType<typeof vi.fn>;
  GetAllCategories: ReturnType<typeof vi.fn>;
};
export type { MockRepositoryInstance };
