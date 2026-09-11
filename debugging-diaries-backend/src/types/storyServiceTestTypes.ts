import { vi } from 'vitest';

type MockRepositoryInstance = {
  CreateStory: ReturnType<typeof vi.fn>;
  GetAllStories: ReturnType<typeof vi.fn>;
  GetStoryByID: ReturnType<typeof vi.fn>;
  UpdateStory: ReturnType<typeof vi.fn>;
  RemoveStory: ReturnType<typeof vi.fn>;
  SearchStory: ReturnType<typeof vi.fn>;
};

type MockAiServiceInstance = {
  getStorySummary: ReturnType<typeof vi.fn>;
};
export type { MockRepositoryInstance, MockAiServiceInstance };
