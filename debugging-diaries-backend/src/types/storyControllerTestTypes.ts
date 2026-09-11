import { vi } from 'vitest';

type MockServiceInstance = {
  CreateStory: ReturnType<typeof vi.fn>;
  GetAllStories: ReturnType<typeof vi.fn>;
  GetStoryByID: ReturnType<typeof vi.fn>;
  UpdateStory: ReturnType<typeof vi.fn>;
  RemoveStory: ReturnType<typeof vi.fn>;
};

export type { MockServiceInstance };
