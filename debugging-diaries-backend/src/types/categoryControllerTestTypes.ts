import { vi } from 'vitest';

export type MockServiceInstance = {
  CreateCategory: ReturnType<typeof vi.fn>;
  GetAllCategories: ReturnType<typeof vi.fn>;
};
